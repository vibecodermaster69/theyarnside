"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Mail, PackageCheck, RefreshCw, Save, ShieldAlert, Truck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type OrderItem = { id: number; product_name: string; quantity: number; unit_price_inr: number };
type Order = {
  id: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  delivery_address: string;
  notes: string | null;
  status: string;
  total_inr: number;
  created_at: string;
  pickup_status?: string;
  shiprocket_order_id?: string | null;
  shiprocket_shipment_id?: string | null;
  awb_code?: string | null;
  courier_name?: string | null;
  tracking_url?: string | null;
  stock_restored_at?: string | null;
  order_items?: OrderItem[];
};

const statuses = ["new", "contacted", "payment_pending", "paid", "making", "shipped", "completed", "cancelled"];
const pickupStatuses = ["not_requested", "requested", "picked_up"];
const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function AdminOrdersPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try { setSupabase(createSupabaseBrowserClient()); } catch (error) { setMessage(error instanceof Error ? error.message : "Supabase is not configured."); }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSessionEmail(data.session?.user.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSessionEmail(session?.user.email ?? null));
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const loadOrders = useCallback(async () => {
    if (!supabase) return;
    setBusy(true);
    const { data, error } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    if (error) setMessage(error.message);
    else { const next = (data ?? []) as Order[]; setOrders(next); setSelectedId((current) => current && next.some((order) => order.id === current) ? current : next[0]?.id ?? null); }
    setBusy(false);
  }, [supabase]);

  useEffect(() => { if (supabase && sessionEmail) void loadOrders(); }, [loadOrders, sessionEmail, supabase]);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const query = search.toLowerCase().trim();
    const matchesSearch = !query || [String(order.id), order.customer_name, order.customer_email ?? "", order.customer_phone].join(" ").toLowerCase().includes(query);
    return matchesSearch && (filter === "all" || order.status === filter || (filter === "pickup" && order.pickup_status === "requested"));
  }), [filter, orders, search]);
  const selectedOrder = orders.find((order) => order.id === selectedId) ?? null;

  if (!sessionEmail) return <main className="orders-page"><section className="orders-login"><p className="orders-eyebrow">THE YARN SIDE</p><h1>Orders workspace</h1><p>Sign in through the main admin page to view orders.</p><Link href="/admin">Go to admin sign in</Link></section><OrdersStyles /></main>;

  return <main className="orders-page"><div className="orders-shell">
    <header className="orders-header"><div><Link href="/admin" className="back-link"><ArrowLeft size={15} /> Store admin</Link><p className="orders-eyebrow">FULFILMENT</p><h1>Orders workspace</h1><p>{sessionEmail}</p></div><button className="outline-button" onClick={loadOrders} disabled={busy}><RefreshCw size={16} /> {busy ? "Refreshing..." : "Refresh orders"}</button></header>
    {message && <p className="orders-message">{message}</p>}
    <div className="orders-toolbar"><input aria-label="Search orders" placeholder="Search order, customer, email, phone" value={search} onChange={(event) => setSearch(event.target.value)} /><select aria-label="Filter orders" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All orders</option>{statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}<option value="pickup">Pickup requested</option></select><span>{filteredOrders.length} order{filteredOrders.length === 1 ? "" : "s"}</span></div>
    <div className="orders-layout"><section className="order-list-panel">{!filteredOrders.length ? <p className="empty-state">No orders match your filters.</p> : filteredOrders.map((order) => <button className={`order-summary ${selectedId === order.id ? "selected" : ""}`} key={order.id} onClick={() => setSelectedId(order.id)}><span><strong>Order #{order.id}</strong><small>{order.customer_name} · {new Date(order.created_at).toLocaleDateString("en-IN")}</small></span><span className="summary-right"><b>{money(order.total_inr)}</b><small>{order.status.replaceAll("_", " ")}</small></span></button>)}</section>{selectedOrder ? <OrderDetails order={selectedOrder} onSaved={(next) => setOrders((current) => current.map((item) => item.id === next.id ? next : item))} setMessage={setMessage} /> : <section className="order-detail empty-state">Select an order to view its details.</section>}</div>
  </div><OrdersStyles /></main>;
}

function OrderDetails({ order, onSaved, setMessage }: { order: Order; onSaved: (order: Order) => void; setMessage: (message: string) => void }) {
  const [status, setStatus] = useState(order.status);
  const [pickupStatus, setPickupStatus] = useState(order.pickup_status ?? "not_requested");
  const [tracking, setTracking] = useState({ shiprocket_order_id: order.shiprocket_order_id ?? "", shiprocket_shipment_id: order.shiprocket_shipment_id ?? "", awb_code: order.awb_code ?? "", courier_name: order.courier_name ?? "", tracking_url: order.tracking_url ?? "" });
  const [busy, setBusy] = useState(false);
  useEffect(() => { setStatus(order.status); setPickupStatus(order.pickup_status ?? "not_requested"); setTracking({ shiprocket_order_id: order.shiprocket_order_id ?? "", shiprocket_shipment_id: order.shiprocket_shipment_id ?? "", awb_code: order.awb_code ?? "", courier_name: order.courier_name ?? "", tracking_url: order.tracking_url ?? "" }); }, [order]);
  const updateOrder = async (changes: Record<string, unknown>, success: string) => {
    setBusy(true);
    try {
      const client = createSupabaseBrowserClient();
      const { data, error } = await client.from("orders").update(changes).eq("id", order.id).select("*, order_items(*)").single();
      if (error) throw error;
      onSaved(data as Order); setMessage(success);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update this order."); }
    setBusy(false);
  };
  const cancelOrder = async () => {
    const alreadyCancelled = order.status === "cancelled";
    if (!window.confirm(alreadyCancelled ? `Restore the items from cancelled order #${order.id} back to stock?` : `Cancel order #${order.id} and add its items back to stock? This cannot be undone automatically.`)) return;
    setBusy(true);
    try {
      const client = createSupabaseBrowserClient();
      const { data, error } = await client.rpc("cancel_order", { p_order_id: order.id });
      if (error) throw error;
      onSaved({ ...(data as Order), order_items: order.order_items });
      setStatus("cancelled");
      const successMessage = alreadyCancelled ? `Stock restored for cancelled order #${order.id}.` : `Order #${order.id} cancelled and stock restored.`;
      setMessage(successMessage);
      window.alert(`Success\n\n${successMessage}\n\nInventory has been updated in Supabase.`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not cancel this order.";
      setMessage(errorMessage);
      window.alert(`Could not update order\n\n${errorMessage}`);
    }
    setBusy(false);
  };
  const saveTracking = (event: FormEvent) => { event.preventDefault(); void updateOrder(tracking, `Tracking details saved for order #${order.id}.`); };
  const markForPickup = () => { setPickupStatus("requested"); void updateOrder({ pickup_status: "requested", pickup_requested_at: new Date().toISOString() }, `Order #${order.id} marked for pickup.`); };
  const email = order.customer_email ? `mailto:${order.customer_email}?subject=${encodeURIComponent(`Update for THE YARN SIDE order #${order.id}`)}&body=${encodeURIComponent(`Hi ${order.customer_name},\n\nYour order #${order.id} is currently ${order.status.replaceAll("_", " ")}.${order.tracking_url ? `\nTrack your parcel: ${order.tracking_url}` : ""}\n\nThank you,\nTHE YARN SIDE`)}` : null;
  return <section className="order-detail"><div className="detail-heading"><div><p className="orders-eyebrow">ORDER #{order.id}</p><h2>{order.customer_name}</h2><p>{new Date(order.created_at).toLocaleString("en-IN")}</p></div>{email ? <a className="primary-button" href={email}><Mail size={16} /> Email customer</a> : <span className="muted">No customer email</span>}</div><div className="detail-grid"><div><h3>Customer & delivery</h3><p><strong>Phone:</strong> {order.customer_phone}</p><p><strong>Email:</strong> {order.customer_email || "Not provided"}</p><p><strong>Address:</strong><br />{order.delivery_address}</p>{order.notes && <p><strong>Notes:</strong><br />{order.notes}</p>}</div><div><h3>Items</h3>{order.order_items?.map((item) => <div className="detail-item" key={item.id}><span>{item.product_name} × {item.quantity}</span><b>{money(item.unit_price_inr * item.quantity)}</b></div>)}<div className="detail-total"><span>Total</span><b>{money(order.total_inr)}</b></div></div></div><div className="action-card"><h3>Order workflow</h3><label>Order status<select value={status} onChange={(event) => { if (event.target.value === "cancelled") { void cancelOrder(); return; } setStatus(event.target.value); void updateOrder({ status: event.target.value }, `Order #${order.id} status updated.`); }}>{statuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></label><label>Pickup status<select value={pickupStatus} onChange={(event) => { setPickupStatus(event.target.value); void updateOrder({ pickup_status: event.target.value }, `Pickup status updated for order #${order.id}.`); }}>{pickupStatuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></label><button className="primary-button" onClick={markForPickup} disabled={busy || pickupStatus === "requested" || pickupStatus === "picked_up"}><PackageCheck size={16} /> {pickupStatus === "not_requested" ? "Mark for pickup" : "Pickup requested"}</button>{!order.stock_restored_at ? <button className="cancel-button" onClick={cancelOrder} disabled={busy}><ShieldAlert size={16} /> {order.status === "cancelled" ? "Restore stock for cancelled order" : "Cancel order & restore stock"}</button> : <p className="cancelled-note"><ShieldAlert size={15} /> Cancelled · stock restored {new Date(order.stock_restored_at).toLocaleString("en-IN")}</p>}<p className="helper">Cancelling an order restores each ordered quantity to its product stock once, inside a database transaction.</p></div><form className="action-card" onSubmit={saveTracking}><h3>Tracking details</h3><div className="tracking-grid">{Object.entries({ shiprocket_order_id: "Shiprocket order ID", shiprocket_shipment_id: "Shipment ID", awb_code: "AWB / tracking number", courier_name: "Courier name", tracking_url: "Tracking URL" }).map(([key, label]) => <label key={key}>{label}<input value={tracking[key as keyof typeof tracking]} onChange={(event) => setTracking((current) => ({ ...current, [key]: event.target.value }))} placeholder={label} /></label>)}</div><button className="outline-button" type="submit" disabled={busy}><Save size={16} /> Save tracking details</button>{tracking.tracking_url && <a className="track-link" href={tracking.tracking_url} target="_blank" rel="noreferrer"><Truck size={15} /> Open tracking page</a>}</form></section>;
}

function OrdersStyles() { return <style jsx global>{`.orders-page{min-height:100vh;padding:42px 24px;background:var(--cream);color:var(--cocoa)}.orders-shell,.orders-login{max-width:1180px;margin:0 auto}.orders-login{max-width:460px;padding:40px;background:var(--white);border:1px solid rgba(75,58,50,.12)}.orders-eyebrow{margin:0 0 7px;color:var(--coral);font:700 11px var(--font-lato),sans-serif;letter-spacing:.12em;text-transform:uppercase}.orders-page h1,.orders-page h2,.orders-page h3{margin:0 0 8px}.orders-page h1{font-size:40px}.orders-page h2{font-size:28px}.orders-page h3{font-size:17px}.orders-header,.detail-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:28px}.orders-header p:not(.orders-eyebrow),.detail-heading p:not(.orders-eyebrow){margin:0;color:rgba(75,58,50,.68);font-size:14px}.back-link,.track-link{display:inline-flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--coral);font-size:13px;font-weight:700;text-decoration:none}.orders-toolbar{display:flex;align-items:center;gap:12px;margin-bottom:18px}.orders-toolbar input{flex:1}.orders-toolbar input,.orders-toolbar select,.action-card input,.action-card select{padding:12px;border:1px solid rgba(75,58,50,.2);border-radius:4px;background:var(--white);color:var(--cocoa);font:400 14px var(--font-lato),sans-serif}.orders-toolbar span{color:rgba(75,58,50,.68);font-size:13px;white-space:nowrap}.orders-layout{display:grid;grid-template-columns:minmax(280px, .8fr) minmax(0, 1.6fr);gap:18px;align-items:start}.order-list-panel,.order-detail,.action-card{background:var(--white);border:1px solid rgba(75,58,50,.1)}.order-list-panel{overflow:hidden}.order-summary{display:flex;align-items:flex-start;justify-content:space-between;width:100%;gap:12px;padding:17px;border:0;border-bottom:1px solid rgba(75,58,50,.1);background:var(--white);color:var(--cocoa);text-align:left;cursor:pointer}.order-summary.selected{background:var(--sage-light);box-shadow:inset 3px 0 var(--sage)}.order-summary small{display:block;margin-top:5px;color:rgba(75,58,50,.65);font-size:12px}.summary-right{text-align:right}.summary-right b{font:700 15px var(--font-playfair),Georgia,serif}.order-detail{padding:28px}.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:20px 0;border-top:1px solid rgba(75,58,50,.1);border-bottom:1px solid rgba(75,58,50,.1)}.detail-grid p{font-size:14px;line-height:1.55}.detail-item,.detail-total{display:flex;justify-content:space-between;gap:14px;padding:9px 0;font-size:14px}.detail-total{margin-top:8px;padding-top:14px;border-top:1px solid rgba(75,58,50,.12);font-size:16px}.action-card{display:grid;gap:13px;margin-top:18px;padding:18px;background:var(--cream)}.action-card label{display:grid;gap:6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}.action-card button,.primary-button,.outline-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;width:max-content;padding:11px 14px;border:0;border-radius:4px;background:var(--coral);color:var(--white);font-weight:700;text-decoration:none;cursor:pointer}.cancel-button{background:#b9504f!important}.cancelled-note{display:flex;align-items:center;gap:6px;margin:0;color:#b9504f;font-size:13px;font-weight:700}.outline-button{border:1px solid rgba(75,58,50,.25);background:transparent;color:var(--cocoa)}.action-card .outline-button{background:var(--white);color:var(--cocoa);border:1px solid rgba(75,58,50,.3)}.action-card button:disabled,.orders-header button:disabled{opacity:.55;cursor:wait}.helper,.muted{margin:0;color:rgba(75,58,50,.68);font-size:12px;line-height:1.5}.tracking-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.track-link{margin:0}.empty-state{padding:40px;text-align:center;color:rgba(75,58,50,.68)}.orders-message{padding:12px;margin-bottom:18px;background:var(--sage-light);border-left:3px solid var(--sage);font-size:14px}@media(max-width:800px){.orders-layout{grid-template-columns:1fr}.orders-toolbar{align-items:stretch;flex-direction:column}.orders-toolbar span{white-space:normal}.detail-grid,.tracking-grid{grid-template-columns:1fr}}@media(max-width:560px){.orders-page{padding:24px 16px}.orders-header,.detail-heading{flex-direction:column}.orders-page h1{font-size:32px}.order-detail{padding:20px}}`}</style>; }
