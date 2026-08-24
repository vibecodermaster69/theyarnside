"use client";

import { FormEvent, useEffect, useState } from "react";
import { LogOut, Plus, Save, Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const categories = ["amigurumi", "wearables", "home-decor", "accessories-gifts"];

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  price_inr: number;
  image_url: string | null;
  stock_quantity: number;
  is_new: boolean;
  is_active: boolean;
};

type ProductDraft = Omit<Product, "id">;

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
};

type OrderRequest = {
  id: number;
  product_name: string;
  quantity: number;
  customer_name: string;
  phone: string;
  shipping_address: string;
  budget_inr: number;
  timeframe: string;
  notes: string | null;
  status: string;
  created_at: string;
};

const orderStatuses = ["new", "contacted", "payment_pending", "paid", "making", "shipped", "completed", "cancelled"];
const requestStatuses = ["new", "contacted", "accepted", "declined", "completed"];

const emptyProduct: ProductDraft = {
  name: "",
  slug: "",
  description: "",
  category: "amigurumi",
  price_inr: 0,
  image_url: "",
  stock_quantity: 0,
  is_new: true,
  is_active: true,
};

export default function AdminPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(emptyProduct);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [instagramLinks, setInstagramLinks] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      setSupabase(createSupabaseBrowserClient());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Supabase is not configured.");
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSessionEmail(nextSession?.user.email ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (sessionEmail && supabase) loadData();
    // loadData is intentionally scoped to this client/session effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionEmail, supabase]);

  async function loadData() {
    if (!supabase) return;
    setMessage("");
    const [{ data: productRows, error: productError }, { data: settingRow }, { data: orderRows, error: orderError }, { data: requestRows, error: requestError }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("value").eq("key", "instagram_links").maybeSingle(),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("order_requests").select("*").order("created_at", { ascending: false }),
    ]);

    if (productError) {
      setMessage(productError.message);
      return;
    }

    setProducts((productRows ?? []) as Product[]);
    if (!orderError) setOrders((orderRows ?? []) as Order[]);
    if (!requestError) setOrderRequests((requestRows ?? []) as OrderRequest[]);
    const links = settingRow?.value;
    setInstagramLinks(Array.isArray(links) ? links.filter((link): link is string => typeof link === "string") : []);
  }

  async function signIn(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Signed in successfully.");
    setBusy(false);
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const payload = { ...draft, price_inr: Number(draft.price_inr), stock_quantity: Number(draft.stock_quantity) };
    const result = editingId
      ? await supabase.from("products").update(payload).eq("id", editingId)
      : await supabase.from("products").insert(payload);

    setMessage(result.error ? result.error.message : "Product saved.");
    if (!result.error) {
      setDraft(emptyProduct);
      setEditingId(null);
      await loadData();
    }
    setBusy(false);
  }

  async function deleteProduct(id: number) {
    if (!supabase) return;
    if (!window.confirm("Delete this product?")) return;
    setBusy(true);
    const { error } = await supabase.from("products").delete().eq("id", id);
    setMessage(error ? error.message : "Product deleted.");
    if (!error) await loadData();
    setBusy(false);
  }

  async function saveInstagramLinks(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const links = instagramLinks.map((link) => link.trim()).filter(Boolean);
    const { error } = await supabase.from("site_settings").upsert({ key: "instagram_links", value: links });
    setMessage(error ? error.message : "Instagram links saved.");
    setInstagramLinks(links);
    setBusy(false);
  }

  function downloadOrderRequests() {
    const headers = ["Request ID", "Created", "Product", "Quantity", "Customer", "Phone", "Shipping Address", "Budget INR", "Timeframe", "Notes", "Status"];
    const escapeCell = (value: string | number | null) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = orderRequests.map((request) => [request.id, new Date(request.created_at).toLocaleString("en-IN"), request.product_name, request.quantity, request.customer_name, request.phone, request.shipping_address, request.budget_inr, request.timeframe.replaceAll("_", " "), request.notes, request.status]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    link.download = `theyarnside-order-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  if (!sessionEmail) {
    return (
      <main className="admin-page">
        <section className="admin-login">
          <p className="admin-eyebrow">THE YARN SIDE</p>
          <h1>Admin sign in</h1>
          <p>Manage products, prices, stock, and Instagram links.</p>
          <form onSubmit={signIn}>
            <label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
          </form>
          {message && <p className="admin-message">{message}</p>}
        </section>
        <AdminStyles />
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div><p className="admin-eyebrow">THE YARN SIDE</p><h1>Store admin</h1><p>{sessionEmail}</p></div>
          <button className="secondary-button" onClick={() => supabase?.auth.signOut()}><LogOut size={16} /> Sign out</button>
        </header>
        {message && <p className="admin-message">{message}</p>}

        <section className="admin-section">
          <div className="section-heading"><div><p className="admin-eyebrow">CATALOGUE</p><h2>{editingId ? "Edit product" : "Add product"}</h2></div>{editingId && <button className="secondary-button" onClick={() => { setDraft(emptyProduct); setEditingId(null); }}>Cancel</button>}</div>
          <form className="product-form" onSubmit={saveProduct}>
            <label>Product name<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
            <label>Slug<input required value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="daisy-market-tote" /></label>
            <label>Category<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
            <label>Price (INR)<input type="number" min="0" required value={draft.price_inr} onChange={(event) => setDraft({ ...draft, price_inr: Number(event.target.value) })} /></label>
            <label>Stock quantity<input type="number" min="0" required value={draft.stock_quantity} onChange={(event) => setDraft({ ...draft, stock_quantity: Number(event.target.value) })} /></label>
            <label>Image URL<input value={draft.image_url ?? ""} onChange={(event) => setDraft({ ...draft, image_url: event.target.value })} placeholder="/assets/..." /></label>
            <label className="wide">Description<textarea rows={3} value={draft.description ?? ""} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
            <label className="check"><input type="checkbox" checked={draft.is_new} onChange={(event) => setDraft({ ...draft, is_new: event.target.checked })} /> Show as new</label>
            <label className="check"><input type="checkbox" checked={draft.is_active} onChange={(event) => setDraft({ ...draft, is_active: event.target.checked })} /> Visible on website</label>
            <button type="submit" disabled={busy}><Save size={16} /> {editingId ? "Update product" : "Add product"}</button>
          </form>
          <div className="product-list">{products.map((product) => <article className="product-row" key={product.id}><div><strong>{product.name}</strong><span>{product.category} · ₹{product.price_inr.toLocaleString("en-IN")} · {product.stock_quantity} in stock</span></div><div className="row-actions"><button aria-label={`Edit ${product.name}`} onClick={() => { setEditingId(product.id); setDraft({ ...product, description: product.description ?? "", image_url: product.image_url ?? "" }); }}><Save size={16} /></button><button aria-label={`Delete ${product.name}`} onClick={() => deleteProduct(product.id)}><Trash2 size={16} /></button></div></article>)}</div>
        </section>

        <section className="admin-section">
          <div className="section-heading"><div><p className="admin-eyebrow">MADE TO ORDER</p><h2>Request orders</h2></div><button className="secondary-button" onClick={downloadOrderRequests} disabled={!orderRequests.length}>Download Excel CSV</button></div>
          {!orderRequests.length ? <p>No request orders yet.</p> : <div className="order-list">{orderRequests.map((request) => <article className="order-card" key={request.id}>
            <div className="order-card-header"><div><strong>Request #{request.id} · {request.product_name}</strong><span>{new Date(request.created_at).toLocaleString("en-IN")}</span></div><select value={request.status} onChange={async (event) => { if (!supabase) return; const nextStatus = event.target.value; const { error } = await supabase.from("order_requests").update({ status: nextStatus }).eq("id", request.id); setMessage(error ? error.message : `Request #${request.id} updated.`); if (!error) setOrderRequests(orderRequests.map((item) => item.id === request.id ? { ...item, status: nextStatus } : item)); }}>{requestStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
            <p><strong>{request.customer_name}</strong> · {request.phone} · Quantity: {request.quantity}</p>
            <p>{request.shipping_address}</p>
            <p>Budget: ₹{request.budget_inr.toLocaleString("en-IN")} · Timing: {request.timeframe.replaceAll("_", " ")}</p>
            {request.notes && <p className="order-notes">Note: {request.notes}</p>}
          </article>)}</div>}
        </section>

        <section className="admin-section">
          <div className="section-heading"><div><p className="admin-eyebrow">ORDERS</p><h2>Order requests</h2></div><button className="secondary-button" onClick={loadData}>Refresh</button></div>
          {!orders.length ? <p>No order requests yet.</p> : <div className="order-list">{orders.map((order) => <article className="order-card" key={order.id}>
            <div className="order-card-header"><div><strong>Order #{order.id}</strong><span>{new Date(order.created_at).toLocaleString("en-IN")}</span></div><select value={order.status} onChange={async (event) => { if (!supabase) return; const nextStatus = event.target.value; const { error } = await supabase.from("orders").update({ status: nextStatus }).eq("id", order.id); setMessage(error ? error.message : `Order #${order.id} updated.`); if (!error) setOrders(orders.map((item) => item.id === order.id ? { ...item, status: nextStatus } : item)); }}>{orderStatuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select></div>
            <p><strong>{order.customer_name}</strong> · {order.customer_phone}{order.customer_email ? ` · ${order.customer_email}` : ""}</p>
            <p>{order.delivery_address}</p>
            {order.notes && <p className="order-notes">Note: {order.notes}</p>}
            <strong>{`₹${order.total_inr.toLocaleString("en-IN")}`}</strong>
          </article>)}</div>}
        </section>

        <section className="admin-section">
          <div className="section-heading"><div><p className="admin-eyebrow">SOCIAL</p><h2>Instagram links</h2></div></div>
          <form onSubmit={saveInstagramLinks} className="links-form">
            {instagramLinks.map((link, index) => <div className="link-row" key={`${index}-${link}`}><input type="url" value={link} onChange={(event) => setInstagramLinks(instagramLinks.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} /><button type="button" aria-label="Remove Instagram link" onClick={() => setInstagramLinks(instagramLinks.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={16} /></button></div>)}
            <button type="button" className="secondary-button" onClick={() => setInstagramLinks([...instagramLinks, "https://www.instagram.com/theyarnside.co/"])}><Plus size={16} /> Add link</button>
            <button type="submit" disabled={busy}><Save size={16} /> Save Instagram links</button>
          </form>
        </section>
      </div>
      <AdminStyles />
    </main>
  );
}

function AdminStyles() {
  return <style jsx global>{`
    .admin-page { min-height: 100vh; background: var(--cream); color: var(--cocoa); padding: 48px 24px; }
    .admin-shell, .admin-login { max-width: 980px; margin: 0 auto; }
    .admin-login { max-width: 460px; background: var(--white); padding: 40px; border: 1px solid rgba(75,58,50,.12); }
    .admin-eyebrow { color: var(--coral); font: 700 12px var(--font-lato), sans-serif; letter-spacing: .12em; text-transform: uppercase; }
    .admin-page h1, .admin-page h2 { margin: 6px 0 8px; }
    .admin-page h1 { font-size: 40px; }
    .admin-page h2 { font-size: 26px; }
    .admin-page p { margin: 0 0 16px; }
    .admin-login form, .product-form, .links-form { display: grid; gap: 16px; margin-top: 28px; }
    .admin-page label { display: grid; gap: 6px; font-weight: 700; font-size: 13px; }
    .admin-page input, .admin-page select, .admin-page textarea { width: 100%; padding: 12px; border: 1px solid rgba(75,58,50,.2); background: var(--white); color: var(--cocoa); border-radius: 4px; font: 400 15px var(--font-lato), sans-serif; }
    .admin-page button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 16px; border: 0; background: var(--coral); color: var(--white); font-weight: 700; cursor: pointer; border-radius: 4px; }
    .admin-page button:disabled { opacity: .6; cursor: wait; }
    .secondary-button { background: transparent !important; color: var(--cocoa) !important; border: 1px solid rgba(75,58,50,.25) !important; }
    .admin-header, .section-heading, .product-row, .link-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .admin-header { margin-bottom: 36px; }
    .admin-section { background: var(--white); padding: 32px; margin-bottom: 24px; border: 1px solid rgba(75,58,50,.1); }
    .product-form { grid-template-columns: repeat(2, 1fr); }
    .product-form .wide, .product-form button { grid-column: 1 / -1; }
    .check { display: flex !important; align-items: center; gap: 8px !important; }
    .check input { width: auto; }
    .product-list { display: grid; gap: 8px; margin-top: 32px; }
    .product-row { padding: 14px 0; border-top: 1px solid rgba(75,58,50,.1); }
    .product-row span { display: block; margin-top: 4px; color: rgba(75,58,50,.7); font-size: 13px; }
    .row-actions { display: flex; gap: 8px; }
    .row-actions button, .link-row button { padding: 9px; background: transparent; color: var(--cocoa); border: 1px solid rgba(75,58,50,.2); }
    .link-row input { flex: 1; }
    .links-form > button { justify-self: start; }
    .admin-message { padding: 12px; background: var(--sage-light); border-left: 3px solid var(--sage); }
    .order-list { display: grid; gap: 12px; margin-top: 24px; }
    .order-card { padding: 18px; border: 1px solid rgba(75,58,50,.12); background: var(--cream); }
    .order-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
    .order-card-header span { display: block; margin-top: 4px; color: rgba(75,58,50,.65); font-size: 12px; }
    .order-card-header select { width: auto; min-width: 150px; }
    .order-card p { margin: 6px 0; font-size: 14px; }
    .order-notes { color: rgba(75,58,50,.75); font-style: italic; }
    @media (max-width: 640px) { .admin-page { padding: 24px 16px; } .admin-section, .admin-login { padding: 24px; } .product-form { grid-template-columns: 1fr; } .product-form .wide, .product-form button { grid-column: auto; } .admin-header, .section-heading, .order-card-header { align-items: flex-start; flex-direction: column; } .product-row { align-items: flex-start; } .order-card-header select { width: 100%; } }
  `}</style>;
}
