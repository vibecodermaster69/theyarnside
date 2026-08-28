"use client";

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  Copy,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Crop as CropIcon,
  Pencil,
  X,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Image as ImageIcon,
  FolderKanban,
  Tags,
  Percent,
  Settings as SettingsIcon,
  Search,
  Eye,
  Download,
  Upload,
  Calendar,
  Truck,
  Star,
} from "lucide-react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./AdminDashboard.css";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { REQUEST_STATUSES, requestStatusLabel } from "@/lib/requestWorkflow";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  price_inr: number;
  image_url: string | null;
  image_urls: string[];
  dimensions: string | null;
  weight_grams: number | null;
  stock_quantity: number;
  color_variants: { name: string; hex: string; stockQuantity: number; imageUrl?: string }[];
  is_new: boolean;
  is_best_seller: boolean;
  is_active: boolean;
};

type Order = {
  id: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  delivery_address: string;
  notes: string | null;
  status: string;
  total_inr: number;
  pickup_status?: string;
  shiprocket_order_id?: string | null;
  shiprocket_shipment_id?: string | null;
  awb_code?: string | null;
  courier_name?: string | null;
  tracking_url?: string | null;
  created_at: string;
  order_items?: OrderItem[];
};

type OrderItem = {
  id: number;
  product_name: string;
  quantity: number;
  unit_price_inr: number;
  variant_name?: string | null;
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

type Inquiry = {
  id: number;
  customer_name: string;
  email: string;
  category: string;
  details: string;
  status: string;
  created_at: string;
};

type AdminDashboardProps = {
  products: Product[];
  orders: Order[];
  orderRequests: OrderRequest[];
  inquiries: Inquiry[];
  categories: string[];
  instagramLinks: string[];
  message: string;
  busy: boolean;
  uploadingImage: boolean;
  sessionEmail: string | null;
  editingId: number | null;
  draft: Omit<Product, "id">;
  newCategory: string;
  currentTab: string;
  selectedOrder: Order | null;
  selectedOrderRequest: OrderRequest | null;
  selectedInquiry: Inquiry | null;
  productSearch: string;
  orderSearch: string;
  inventorySearch: string;
  showProductForm: boolean;
  selectedMediaUrl: string | null;
  cropSrc: string;
  crop: Crop | undefined;
  completedCrop: PixelCrop | null;
  imgRef: any;
  imageToReplace: string | null;
  confirmConfig: { message: string; onConfirm: () => void } | null;
  supabase: ReturnType<typeof createSupabaseBrowserClient> | null;
  setConfirmConfig: (config: { message: string; onConfirm: () => void } | null) => void;

  setCurrentTab: (tab: any) => void;
  setSelectedOrder: (order: Order | null) => void;
  setSelectedOrderRequest: (req: OrderRequest | null) => void;
  setProductSearch: (s: string) => void;
  setOrderSearch: (s: string) => void;
  setInventorySearch: (s: string) => void;
  setShowProductForm: (b: boolean) => void;
  setSelectedMediaUrl: (s: string | null) => void;
  setDraft: React.Dispatch<React.SetStateAction<Omit<Product, "id">>>;
  setEditingId: (id: number | null) => void;
  setNewCategory: (s: string) => void;
  setInstagramLinks: React.Dispatch<React.SetStateAction<string[]>>;
  setMessage: (s: string) => void;
  setBusy: (b: boolean) => void;
  setUploadingImage: (b: boolean) => void;
  loadData: () => Promise<void>;
  saveProduct: (e: React.FormEvent) => Promise<void>;
  addCategory: (e: React.FormEvent) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  saveInstagramLinks: (e: React.FormEvent) => Promise<void>;
  updateOrderStatus: (id: number, status: string) => Promise<void>;
  handleSelectFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  handleConfirmCrop: () => Promise<void>;
  handleAdjustCrop: (url: string) => Promise<void>;
  removeImage: (url: string) => void;
  setDefaultImage: (url: string) => void;
  updateRequestStatus: (id: number, status: string) => Promise<void>;
  updateInquiryStatus: (id: number, status: string) => Promise<void>;
  setSelectedInquiry: (inquiry: Inquiry | null) => void;
  copyImagePrompt: () => Promise<void>;
  downloadOrderRequests: () => void;
  signOut: () => void;
  setCrop: (crop: Crop | undefined) => void;
  setCompletedCrop: (crop: PixelCrop | null) => void;
  setCropSrc: (src: string) => void;
};

export default function AdminDashboard({
  products,
  orders,
  orderRequests,
  inquiries,
  categories,
  instagramLinks,
  message,
  busy,
  uploadingImage,
  sessionEmail,
  editingId,
  draft,
  newCategory,
  currentTab,
  selectedOrder,
  selectedOrderRequest,
  selectedInquiry,
  productSearch,
  orderSearch,
  inventorySearch,
  showProductForm,
  selectedMediaUrl,
  cropSrc,
  crop,
  completedCrop,
  imgRef,
  imageToReplace,
  setCurrentTab,
  setSelectedOrder,
  setSelectedOrderRequest,
  setProductSearch,
  setOrderSearch,
  setInventorySearch,
  setShowProductForm,
  setSelectedMediaUrl,
  setDraft,
  setEditingId,
  setNewCategory,
  setInstagramLinks,
  setMessage,
  setBusy,
  loadData,
  saveProduct,
  addCategory,
  deleteProduct,
  saveInstagramLinks,
  updateOrderStatus,
  handleSelectFile,
  onImageLoad,
  handleConfirmCrop,
  handleAdjustCrop,
  removeImage,
  setDefaultImage,
  updateRequestStatus,
  updateInquiryStatus,
  setSelectedInquiry,
  copyImagePrompt,
  downloadOrderRequests,
  signOut,
  setCrop,
  setCompletedCrop,
  setCropSrc,
  confirmConfig,
  setConfirmConfig,
  supabase,
}: AdminDashboardProps) {

  // Shipping & Tracking State
  const [tracking, setTracking] = React.useState({
    shiprocket_order_id: "",
    shiprocket_shipment_id: "",
    awb_code: "",
    courier_name: "",
    tracking_url: "",
  });
  const [pickupStatus, setPickupStatus] = React.useState("not_requested");

  // Sync state whenever selectedOrder changes
  React.useEffect(() => {
    if (selectedOrder) {
      setTracking({
        shiprocket_order_id: selectedOrder.shiprocket_order_id ?? "",
        shiprocket_shipment_id: selectedOrder.shiprocket_shipment_id ?? "",
        awb_code: selectedOrder.awb_code ?? "",
        courier_name: selectedOrder.courier_name ?? "",
        tracking_url: selectedOrder.tracking_url ?? "",
      });
      setPickupStatus(selectedOrder.pickup_status ?? "not_requested");
    }
  }, [selectedOrder]);

  const saveTrackingDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !selectedOrder) return;
    setBusy(true);
    const { error } = await supabase
      .from("orders")
      .update({
        ...tracking,
        pickup_status: pickupStatus,
      })
      .eq("id", selectedOrder.id);
    setBusy(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage(`Tracking details saved for order #${selectedOrder.id}`);
      await loadData();
    }
  };

  const markForPickup = async () => {
    if (!supabase || !selectedOrder) return;
    setBusy(true);
    const { error } = await supabase
      .from("orders")
      .update({
        pickup_status: "requested",
        pickup_requested_at: new Date().toISOString(),
      })
      .eq("id", selectedOrder.id);
    setBusy(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage(`Order #${selectedOrder.id} marked for pickup.`);
      setPickupStatus("requested");
      await loadData();
    }
  };

  // Inline styling overrides for standard badges
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
      case "new order":
        return <span className="badge badge-new">New Order</span>;
      case "pending":
      case "payment_pending":
        return <span className="badge badge-pending">Payment Pending</span>;
      case "processing":
      case "making":
        return <span className="badge badge-processing">Processing</span>;
      case "shipped":
        return <span className="badge badge-shipped">Shipped</span>;
      case "completed":
        return <span className="badge badge-completed">Completed</span>;
      case "cancelled":
        return <span className="badge badge-cancelled">Cancelled</span>;
      case "accepted":
        return <span className="badge badge-processing">Accepted</span>;
      case "in_progress":
        return <span className="badge badge-pending">In Progress</span>;
      case "packed":
        return <span className="badge badge-shipped">Packed</span>;
      case "rejected":
        return <span className="badge badge-cancelled">Rejected</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  // Accept / Reject buttons plus a free-form status picker. The sequence is a
  // suggestion — any status can be set at any time, and cancelling is always
  // available.
  const renderWorkflowControls = (
    status: string,
    onChange: (status: string) => void,
    kind: "request" | "inquiry",
  ) => (
    <>
      {status === "new" && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="button" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => onChange("accepted")}>
            Accept
          </button>
          <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => onChange("rejected")}>
            Reject
          </button>
        </div>
      )}
      <div className="form-group">
        <label>Update {kind === "request" ? "Request" : "Inquiry"} Status</label>
        <select
          value={status}
          onChange={(e) => onChange(e.target.value)}
          className="filter-select"
          style={{ width: "100%" }}
        >
          {REQUEST_STATUSES.map((st) => (
            <option key={st} value={st}>{requestStatusLabel(st)}</option>
          ))}
        </select>
      </div>
      {status !== "cancelled" && status !== "rejected" && (
        <button type="button" className="btn btn-secondary" style={{ justifyContent: "center", color: "#DC3545" }} onClick={() => onChange("cancelled")}>
          Cancel this {kind}
        </button>
      )}
    </>
  );

  // Helper to extract all media from products
  const getAllMedia = () => {
    const allUrls: string[] = [];
    products.forEach((p) => {
      if (p.image_url && !allUrls.includes(p.image_url)) {
        allUrls.push(p.image_url);
      }
      p.image_urls?.forEach((url) => {
        if (url && !allUrls.includes(url)) {
          allUrls.push(url);
        }
      });
    });
    return allUrls;
  };

  // Count low stock items
  const lowStockCount = products.filter((p) => p.stock_quantity <= 5).length;

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <img src="/assets/logos/monogram_ys.png" alt="The Yarn Side" style={{ width: "40px", height: "40px" }} />
            <div>
              <strong style={{ display: "block", fontSize: "16px", letterSpacing: "0.05em", fontFamily: "var(--font-playfair)" }}>THE YARN SIDE</strong>
              <small style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Store management</small>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <button className={`sidebar-link ${currentTab === "dashboard" ? "active" : ""}`} onClick={() => setCurrentTab("dashboard")}>
              <span className="sidebar-link-content">
                <LayoutDashboard size={18} />
                Dashboard
              </span>
            </button>
            <button className={`sidebar-link ${currentTab === "orders" ? "active" : ""}`} onClick={() => { setCurrentTab("orders"); setSelectedOrder(null); }}>
              <span className="sidebar-link-content">
                <ShoppingBag size={18} />
                Orders
              </span>
              {(orders.length + orderRequests.length + inquiries.length) > 0 && (
                <span className="sidebar-badge">{orders.length + orderRequests.length + inquiries.length}</span>
              )}
            </button>
            <button className={`sidebar-link ${currentTab === "products" ? "active" : ""}`} onClick={() => setCurrentTab("products")}>
              <span className="sidebar-link-content">
                <Package size={18} />
                Products
              </span>
            </button>
            <button className={`sidebar-link ${currentTab === "inventory" ? "active" : ""}`} onClick={() => setCurrentTab("inventory")}>
              <span className="sidebar-link-content">
                <FolderKanban size={18} />
                Inventory
              </span>
              {lowStockCount > 0 && <span className="sidebar-badge" style={{ backgroundColor: "#F8D7DA", color: "#721C24" }}>{lowStockCount}</span>}
            </button>
            <button className={`sidebar-link ${currentTab === "shipping" ? "active" : ""}`} onClick={() => setCurrentTab("shipping")}>
              <span className="sidebar-link-content">
                <Truck size={18} />
                Shipping
              </span>
              {orders.filter((o) => o.pickup_status === "requested").length > 0 && (
                <span className="sidebar-badge" style={{ backgroundColor: "#FFE8D6", color: "#A7523E" }}>
                  {orders.filter((o) => o.pickup_status === "requested").length}
                </span>
              )}
            </button>
            <button className={`sidebar-link ${currentTab === "media-library" ? "active" : ""}`} onClick={() => setCurrentTab("media-library")}>
              <span className="sidebar-link-content">
                <ImageIcon size={18} />
                Media Library
              </span>
            </button>
            <button className={`sidebar-link ${currentTab === "settings" ? "active" : ""}`} onClick={() => setCurrentTab("settings")}>
              <span className="sidebar-link-content">
                <SettingsIcon size={18} />
                Settings
              </span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-love-card">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#E47E6E">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <p>Handmade with love, just for you.</p>
          </div>

          <button className="sidebar-logout" onClick={signOut}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-title">
            <span style={{ textTransform: "capitalize", fontWeight: 700, fontSize: "18px" }}>{currentTab}</span>
          </div>

          <div className="topbar-right">
            <button className="btn btn-secondary" onClick={loadData} disabled={busy} style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <RefreshCw size={15} className={busy ? "spin" : ""} />
              Refresh
            </button>
            <div className="user-profile">
              <div className="user-avatar">{sessionEmail?.[0].toUpperCase() ?? "A"}</div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Panel */}
        <div className="content-panel">
          {message && (
            <div style={{ background: "#FFF3CD", border: "1px solid #FFEBAA", color: "#856404", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
              <span>{message}</span>
              <button onClick={() => setMessage("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#856404", fontWeight: "bold" }}>X</button>
            </div>
          )}

          {/* Crop Overlay Modal */}
          {cropSrc && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" }}>
              <div className="form-card" style={{ maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, fontFamily: "var(--font-playfair)", fontSize: "20px" }}>Crop & Adjust Image</h3>
                  <button onClick={() => setCropSrc("")} className="btn-icon"><X size={20} /></button>
                </div>
                <div className="cropper-container">
                  <div className="cropper-wrap">
                    <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={4 / 5}>
                      <img ref={imgRef} alt="Crop source" src={cropSrc} onLoad={onImageLoad} className="cropper-img" />
                    </ReactCrop>
                  </div>
                  <div className="cropper-actions" style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    <button className="btn btn-secondary" onClick={() => setCropSrc("")}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleConfirmCrop}>Apply Crop</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Dialog Modal */}
          {confirmConfig && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1100, padding: "20px" }}>
              <div className="form-card" style={{ maxWidth: "420px", width: "100%", textAlign: "center", padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-playfair)", fontSize: "22px" }}>Are you sure?</h3>
                <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "14px", lineHeight: "1.5" }}>{confirmConfig.message}</p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button className="btn btn-secondary" onClick={() => setConfirmConfig(null)}>Cancel</button>
                  <button className="btn btn-primary" style={{ backgroundColor: "#DC3545" }} onClick={() => { confirmConfig.onConfirm(); setConfirmConfig(null); }}>Confirm</button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Dashboard */}
          {currentTab === "dashboard" && (
            <div>
              <div className="content-header">
                <div className="content-title">
                  <h2>Welcome back, Admin</h2>
                  <p>Here is what's happening with your crochet boutique today.</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrap"><ShoppingBag size={24} /></div>
                  <div className="stat-info">
                    <h3>Total Orders</h3>
                    <p>{orders.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrap"><ClipboardList size={24} /></div>
                  <div className="stat-info">
                    <h3>Requests &amp; Inquiries</h3>
                    <p>{orderRequests.length + inquiries.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrap"><Package size={24} /></div>
                  <div className="stat-info">
                    <h3>Total Products</h3>
                    <p>{products.length}</p>
                  </div>
                </div>
                <div className="stat-card" style={{ borderColor: lowStockCount > 0 ? "#F8D7DA" : "var(--color-border)" }}>
                  <div className="stat-icon-wrap" style={{ backgroundColor: lowStockCount > 0 ? "#FDEAEB" : "var(--color-brand-light)", color: lowStockCount > 0 ? "#DC3545" : "var(--color-brand)" }}><FolderKanban size={24} /></div>
                  <div className="stat-info">
                    <h3>Low Stock Alerts</h3>
                    <p>{lowStockCount}</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="table-wrapper">
                <div style={{ padding: "20px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontFamily: "var(--font-playfair)", fontSize: "18px" }}>Recent Orders</h3>
                  <button className="btn btn-secondary" onClick={() => setCurrentTab("orders")} style={{ padding: "6px 12px", fontSize: "13px" }}>View All Orders</button>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} style={{ cursor: "pointer" }} onClick={() => { setCurrentTab("orders"); setSelectedOrder(order); setSelectedOrderRequest(null); setSelectedInquiry(null); }}>
                        <td><strong>#{order.id}</strong></td>
                        <td>{order.customer_name}</td>
                        <td>₹{order.total_inr.toLocaleString("en-IN")}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>{new Date(order.created_at).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Orders */}
          {currentTab === "orders" && (
            <div className="split-view-container">
              {/* Left Orders Table list */}
              <div className="split-left">
                <div className="content-header">
                  <div className="content-title">
                    <h2>Orders & Custom Requests</h2>
                    <p>Manage customer orders, follow-ups, and custom request statuses.</p>
                  </div>
                  <button className="btn btn-primary" onClick={downloadOrderRequests} disabled={!orderRequests.length}>
                    <Download size={16} /> Export Excel CSV
                  </button>
                </div>

                <div className="search-filter-row">
                  <div className="search-input-wrap">
                    <Search size={18} />
                    <input type="text" placeholder="Search customer, order id or phone..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} />
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Type</th>
                        <th>Items/Details</th>
                        <th>Total/Budget</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render direct orders */}
                      {orders
                        .filter((o) => {
                          const query = orderSearch.toLowerCase();
                          return o.customer_name.toLowerCase().includes(query) || String(o.id).includes(query) || o.customer_phone.includes(query);
                        })
                        .map((order) => (
                          <tr key={`o-${order.id}`} style={{ cursor: "pointer" }} onClick={() => { setSelectedOrder(order); setSelectedOrderRequest(null); setSelectedInquiry(null); }} className={selectedOrder?.id === order.id ? "selected-row" : ""}>
                            <td><strong>#{order.id}</strong></td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
                              <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{order.customer_phone}</div>
                            </td>
                            <td><span style={{ fontSize: "12px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#EAE0D5", fontWeight: 600 }}>Web</span></td>
                            <td>{order.order_items?.map((item) => `${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ""} x${item.quantity}`).join(", ") || "No items listed"}</td>
                            <td><strong>₹{order.total_inr.toLocaleString("en-IN")}</strong></td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>{new Date(order.created_at).toLocaleDateString("en-IN")}</td>
                          </tr>
                        ))}

                      {/* Render custom order requests */}
                      {orderRequests
                        .filter((r) => {
                          const query = orderSearch.toLowerCase();
                          return r.customer_name.toLowerCase().includes(query) || String(r.id).includes(query) || r.phone.includes(query);
                        })
                        .map((req) => (
                          <tr key={`r-${req.id}`} style={{ cursor: "pointer" }} onClick={() => { setSelectedOrderRequest(req); setSelectedOrder(null); setSelectedInquiry(null); }} className={selectedOrderRequest?.id === req.id ? "selected-row" : ""}>
                            <td><strong>Req #{req.id}</strong></td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{req.customer_name}</div>
                              <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{req.phone}</div>
                            </td>
                            <td><span style={{ fontSize: "12px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#FCE1DC", color: "#D97364", fontWeight: 600 }}>Custom</span></td>
                            <td>{req.product_name} x{req.quantity}</td>
                            <td><strong>₹{req.budget_inr.toLocaleString("en-IN")}</strong></td>
                            <td>{getStatusBadge(req.status)}</td>
                            <td>{new Date(req.created_at).toLocaleDateString("en-IN")}</td>
                          </tr>
                        ))}

                      {/* Render bespoke inquiries */}
                      {inquiries
                        .filter((inq) => {
                          const query = orderSearch.toLowerCase();
                          return inq.customer_name.toLowerCase().includes(query) || String(inq.id).includes(query) || inq.email.toLowerCase().includes(query);
                        })
                        .map((inq) => (
                          <tr key={`i-${inq.id}`} style={{ cursor: "pointer" }} onClick={() => { setSelectedInquiry(inq); setSelectedOrder(null); setSelectedOrderRequest(null); }} className={selectedInquiry?.id === inq.id ? "selected-row" : ""}>
                            <td><strong>Inq #{inq.id}</strong></td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{inq.customer_name}</div>
                              <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{inq.email}</div>
                            </td>
                            <td><span style={{ fontSize: "12px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#E8E4F3", color: "#5B4B8A", fontWeight: 600 }}>Inquiry</span></td>
                            <td>{inq.category}</td>
                            <td><span style={{ color: "var(--color-text-muted)" }}>—</span></td>
                            <td>{getStatusBadge(inq.status)}</td>
                            <td>{new Date(inq.created_at).toLocaleDateString("en-IN")}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Side Detail Drawer */}
              {(selectedOrder || selectedOrderRequest || selectedInquiry) && (
                <div className="split-right">
                  <div className="detail-header">
                    <div>
                      <h3 style={{ margin: 0, fontFamily: "var(--font-playfair)", fontSize: "18px" }}>
                        {selectedOrder ? `Order #${selectedOrder.id}` : selectedOrderRequest ? `Request #${selectedOrderRequest.id}` : `Inquiry #${selectedInquiry?.id}`}
                      </h3>
                      <small style={{ color: "var(--color-text-muted)" }}>
                        Placed on {new Date(selectedOrder ? selectedOrder.created_at : selectedOrderRequest ? selectedOrderRequest.created_at : selectedInquiry!.created_at).toLocaleString("en-IN")}
                      </small>
                    </div>
                    <button onClick={() => { setSelectedOrder(null); setSelectedOrderRequest(null); setSelectedInquiry(null); }} className="btn-icon"><X size={20} /></button>
                  </div>

                  {selectedOrder && (
                    <>
                      <div>
                        <div className="detail-section-title">Customer Information</div>
                        <div className="detail-row"><span>Name:</span><strong>{selectedOrder.customer_name}</strong></div>
                        <div className="detail-row"><span>Phone:</span><strong>{selectedOrder.customer_phone}</strong></div>
                        {selectedOrder.customer_email && <div className="detail-row"><span>Email:</span><strong>{selectedOrder.customer_email}</strong></div>}
                        <div className="detail-row" style={{ flexDirection: "column", gap: "4px" }}>
                          <span>Shipping Address:</span>
                          <strong style={{ fontSize: "13px", lineHeight: "1.4" }}>{selectedOrder.delivery_address}</strong>
                        </div>
                      </div>

                      <div>
                        <div className="detail-section-title">Order Items</div>
                        {selectedOrder.order_items?.map((item) => (
                          <div key={item.id} className="detail-row" style={{ borderBottom: "1px dashed var(--color-border)", padding: "8px 0" }}>
                            <div>
                              <strong style={{ display: "block" }}>{item.product_name}{item.variant_name ? ` · ${item.variant_name}` : ""}</strong>
                              <small style={{ color: "var(--color-text-muted)" }}>Qty: {item.quantity}</small>
                            </div>
                            <strong>₹{(item.unit_price_inr * item.quantity).toLocaleString("en-IN")}</strong>
                          </div>
                        ))}
                        <div className="detail-row" style={{ marginTop: "12px", fontSize: "16px" }}>
                          <span>Total Paid:</span>
                          <strong>₹{selectedOrder.total_inr.toLocaleString("en-IN")}</strong>
                        </div>
                      </div>

                      {selectedOrder.notes && (
                        <div>
                          <div className="detail-section-title">Customer Note</div>
                          <p style={{ margin: 0, fontSize: "13px", background: "#FAF6F4", padding: "10px", borderRadius: "6px", fontStyle: "italic" }}>{selectedOrder.notes}</p>
                        </div>
                      )}
                      {/* Shipping & Tracking Section */}
                      <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "16px", marginTop: "16px" }}>
                        <div className="detail-section-title" style={{ marginBottom: "12px" }}>Shipping & Tracking</div>
                        
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                          <div style={{ flexGrow: 1 }}>
                            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Pickup Status</label>
                            <select value={pickupStatus} onChange={(e) => {
                              setPickupStatus(e.target.value);
                              const client = supabase;
                              if (client) {
                                client.from("orders").update({ pickup_status: e.target.value }).eq("id", selectedOrder.id).then(() => loadData());
                              }
                            }} className="filter-select" style={{ width: "100%" }}>
                              {["not_requested", "requested", "picked_up"].map((st) => (
                                <option key={st} value={st}>{st.replace("_", " ")}</option>
                              ))}
                            </select>
                          </div>
                          
                          <button
                            className="btn btn-secondary"
                            style={{ alignSelf: "flex-end", height: "38px", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
                            onClick={markForPickup}
                            disabled={pickupStatus === "requested" || pickupStatus === "picked_up"}
                          >
                            <Truck size={14} /> Mark Pickup
                          </button>
                        </div>

                        <form onSubmit={saveTrackingDetails} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "2px" }}>Shiprocket Order ID</label>
                              <input type="text" className="filter-select" style={{ width: "100%", padding: "6px 10px" }} value={tracking.shiprocket_order_id} onChange={(e) => setTracking({...tracking, shiprocket_order_id: e.target.value})} />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "2px" }}>Shipment ID</label>
                              <input type="text" className="filter-select" style={{ width: "100%", padding: "6px 10px" }} value={tracking.shiprocket_shipment_id} onChange={(e) => setTracking({...tracking, shiprocket_shipment_id: e.target.value})} />
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "2px" }}>AWB / Tracking No.</label>
                              <input type="text" className="filter-select" style={{ width: "100%", padding: "6px 10px" }} value={tracking.awb_code} onChange={(e) => setTracking({...tracking, awb_code: e.target.value})} />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "2px" }}>Courier Name</label>
                              <input type="text" className="filter-select" style={{ width: "100%", padding: "6px 10px" }} value={tracking.courier_name} onChange={(e) => setTracking({...tracking, courier_name: e.target.value})} />
                            </div>
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "2px" }}>Tracking URL</label>
                            <input type="url" className="filter-select" style={{ width: "100%", padding: "6px 10px" }} value={tracking.tracking_url} onChange={(e) => setTracking({...tracking, tracking_url: e.target.value})} />
                          </div>
                          
                          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                            <button type="submit" className="btn btn-secondary" style={{ flexGrow: 1, justifyContent: "center", padding: "6px 12px", fontSize: "13px" }}>
                              Save Tracking
                            </button>
                            {tracking.tracking_url && (
                              <a href={tracking.tracking_url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: "6px 12px", display: "flex", alignItems: "center" }}>
                                Track Package
                              </a>
                            )}
                          </div>
                        </form>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
                        <div className="form-group">
                          <label>Update Order Status</label>
                          <select value={selectedOrder.status} onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)} className="filter-select" style={{ width: "100%" }}>
                            {["new", "contacted", "payment_pending", "paid", "making", "shipped", "completed", "cancelled"].map((st) => (
                              <option key={st} value={st}>{st.replace("_", " ")}</option>
                            ))}
                          </select>
                        </div>
                        <a href={`https://wa.me/${selectedOrder.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                          Chat on WhatsApp
                        </a>
                      </div>
                    </>
                  )}

                  {selectedOrderRequest && (
                    <>
                      <div>
                        <div className="detail-section-title">Custom Request Details</div>
                        <div className="detail-row"><span>Customer:</span><strong>{selectedOrderRequest.customer_name}</strong></div>
                        <div className="detail-row"><span>Phone:</span><strong>{selectedOrderRequest.phone}</strong></div>
                        <div className="detail-row"><span>Product Requested:</span><strong>{selectedOrderRequest.product_name}</strong></div>
                        <div className="detail-row"><span>Quantity:</span><strong>{selectedOrderRequest.quantity}</strong></div>
                        <div className="detail-row"><span>Budget Limit:</span><strong>₹{selectedOrderRequest.budget_inr.toLocaleString("en-IN")}</strong></div>
                        <div className="detail-row"><span>Timeframe:</span><strong>{selectedOrderRequest.timeframe.replace("_", " ")}</strong></div>
                        <div className="detail-row" style={{ flexDirection: "column", gap: "4px" }}>
                          <span>Shipping Destination:</span>
                          <strong style={{ fontSize: "13px", lineHeight: "1.4" }}>{selectedOrderRequest.shipping_address}</strong>
                        </div>
                      </div>

                      {selectedOrderRequest.notes && (
                        <div>
                          <div className="detail-section-title">Design Notes</div>
                          <p style={{ margin: 0, fontSize: "13px", background: "#FAF6F4", padding: "10px", borderRadius: "6px" }}>{selectedOrderRequest.notes}</p>
                        </div>
                      )}

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
                        {renderWorkflowControls(
                          selectedOrderRequest.status,
                          (status) => updateRequestStatus(selectedOrderRequest.id, status),
                          "request",
                        )}
                        <a href={`https://wa.me/${selectedOrderRequest.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                          Chat on WhatsApp
                        </a>
                      </div>
                    </>
                  )}

                  {selectedInquiry && (
                    <>
                      <div>
                        <div className="detail-section-title">Inquiry Details</div>
                        <div className="detail-row"><span>Customer:</span><strong>{selectedInquiry.customer_name}</strong></div>
                        <div className="detail-row"><span>Email:</span><strong>{selectedInquiry.email}</strong></div>
                        <div className="detail-row"><span>Item Category:</span><strong>{selectedInquiry.category}</strong></div>
                      </div>

                      <div>
                        <div className="detail-section-title">Their Idea</div>
                        <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.5, background: "#FAF6F4", padding: "10px", borderRadius: "6px", whiteSpace: "pre-wrap" }}>{selectedInquiry.details}</p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
                        {renderWorkflowControls(
                          selectedInquiry.status,
                          (status) => updateInquiryStatus(selectedInquiry.id, status),
                          "inquiry",
                        )}
                        <a href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(`Re: your THE YARN SIDE inquiry #${selectedInquiry.id}`)}`} className="btn btn-secondary" style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                          Reply by email
                        </a>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Products */}
          {currentTab === "products" && (
            <div>
              {/* Product Form Overlay/Toggle */}
              {showProductForm ? (
                <div>
                  <div className="content-header">
                    <div className="content-title">
                      <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
                      <p>Upload details, configure prices, stock limits, and crop product images.</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => { setShowProductForm(false); setEditingId(null); setDraft({ name: "", slug: "", description: "", category: "amigurumi", price_inr: 0, image_url: "", image_urls: [], dimensions: "", weight_grams: null, stock_quantity: 0, color_variants: [], is_new: true, is_best_seller: false, is_active: true }); }}>
                      Back to Catalog
                    </button>
                  </div>

                  <form className="two-column-form" onSubmit={async (e) => { await saveProduct(e); setShowProductForm(false); }}>
                    {/* Left details panel */}
                    <div className="form-card">
                      <div className="form-group">
                        <label>Product Title *</label>
                        <input type="text" required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} placeholder="e.g. Handmade Daisy Tote" />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Category *</label>
                          <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Slug (URL Friendly) *</label>
                          <input type="text" required value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
                        </div>
                      </div>

                      <div className="form-card" style={{ marginTop: "16px", padding: "16px", background: "var(--color-brand-light)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                          <div><strong>Colour options</strong><p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--color-text-muted)" }}>Each colour has separate stock and may use its own gallery image.</p></div>
                          <button type="button" className="btn btn-secondary" onClick={() => setDraft({ ...draft, color_variants: [...(draft.color_variants ?? []), { name: "", hex: "#E47E6E", stockQuantity: 0, imageUrl: "" }] })}><Plus size={15} /> Add colour</button>
                        </div>
                        {(draft.color_variants ?? []).map((variant, index) => (
                          <div key={`${index}-${variant.name}`} style={{ display: "grid", gridTemplateColumns: "1fr 52px .7fr 1.4fr auto", gap: "8px", alignItems: "end", marginTop: "12px" }}>
                            <label>Colour name<input required type="text" value={variant.name} placeholder="Red" onChange={(e) => { const next = [...draft.color_variants]; next[index] = { ...variant, name: e.target.value }; setDraft({ ...draft, color_variants: next }); }} /></label>
                            <label>Pick<input type="color" value={variant.hex || "#E47E6E"} title="Pick colour" onChange={(e) => { const next = [...draft.color_variants]; next[index] = { ...variant, hex: e.target.value }; setDraft({ ...draft, color_variants: next }); }} /></label>
                            <label>Stock<input required type="number" min="0" value={variant.stockQuantity} onChange={(e) => { const next = [...draft.color_variants]; next[index] = { ...variant, stockQuantity: Math.max(0, Number(e.target.value)) }; setDraft({ ...draft, color_variants: next }); }} /></label>
                            <label>Colour image<select value={variant.imageUrl ?? ""} onChange={(e) => { const next = [...draft.color_variants]; next[index] = { ...variant, imageUrl: e.target.value }; setDraft({ ...draft, color_variants: next }); }}><option value="">Use default image</option>{(draft.image_urls ?? []).map((url, imageIndex) => <option key={url} value={url}>Image {imageIndex + 1}</option>)}</select></label>
                            <button type="button" className="btn-icon" aria-label="Remove colour" onClick={() => setDraft({ ...draft, color_variants: draft.color_variants.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>

                      <div className="form-group">
                        <label>Full Description</label>
                        <textarea rows={4} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Describe materials, size, yarn quality, custom color options..." />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Price (INR) *</label>
                          <input type="number" required min="0" value={draft.price_inr} onChange={(e) => setDraft({ ...draft, price_inr: Number(e.target.value) })} />
                        </div>
                        <div className="form-group">
                          <label>Stock Quantity *</label>
                          <input type="number" required min="0" value={draft.stock_quantity} onChange={(e) => setDraft({ ...draft, stock_quantity: Number(e.target.value) })} />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Dimensions (e.g. 25 x 18 cm)</label>
                          <input type="text" value={draft.dimensions ?? ""} onChange={(e) => setDraft({ ...draft, dimensions: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label>Weight (grams)</label>
                          <input type="number" min="0" value={draft.weight_grams ?? ""} onChange={(e) => setDraft({ ...draft, weight_grams: e.target.value ? Number(e.target.value) : null })} />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "24px", marginTop: "12px" }}>
                        <label className="check" style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <input type="checkbox" checked={draft.is_new} onChange={(e) => setDraft({ ...draft, is_new: e.target.checked })} />
                          Show as New Arrival
                        </label>
                        <label className="check" style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} />
                          Publish / Show on Storefront
                        </label>
                        {editingId && (
                          <label className="check best-seller-toggle" style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <input type="checkbox" checked={draft.is_best_seller} onChange={(e) => setDraft({ ...draft, is_best_seller: e.target.checked })} />
                            Mark as Best Seller
                          </label>
                        )}
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ marginTop: "12px", width: "100%", justifyContent: "center" }}>
                        <Save size={18} /> {editingId ? "Update Listing" : "Publish Product"}
                      </button>
                    </div>

                    {/* Right media + preview panel */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      <div className="form-card">
                        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>Product Images</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "10px", margin: "10px 0" }}>
                          {draft.image_urls?.map((url, idx) => {
                            const isCover = draft.image_url === url;
                            return (
                            <div key={idx} style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", border: isCover ? "2px solid var(--color-brand)" : "1px solid var(--color-border)" }}>
                              <img src={url} alt={`Draft ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              <button
                                type="button"
                                onClick={() => setDefaultImage(url)}
                                disabled={isCover}
                                title={isCover ? "This is the storefront image" : "Use as storefront image"}
                                aria-label={isCover ? "Current storefront image" : "Use as storefront image"}
                                aria-pressed={isCover}
                                style={{ position: "absolute", top: "4px", left: "4px", display: "flex", background: isCover ? "var(--color-brand)" : "rgba(255,255,255,0.85)", color: isCover ? "white" : "var(--color-text)", border: "none", padding: "3px", borderRadius: "4px", cursor: isCover ? "default" : "pointer" }}
                              >
                                <Star size={12} fill={isCover ? "currentColor" : "transparent"} />
                              </button>
                              {isCover && (
                                <span style={{ position: "absolute", top: "4px", right: "4px", background: "var(--color-brand)", color: "white", fontSize: "8px", fontWeight: 700, letterSpacing: "0.05em", padding: "2px 5px", borderRadius: "4px" }}>COVER</span>
                              )}
                              <div style={{ position: "absolute", bottom: "4px", left: "4px", right: "4px", display: "flex", justifyContent: "space-between" }}>
                                <button type="button" onClick={() => handleAdjustCrop(url)} style={{ background: "rgba(255,255,255,0.8)", border: "none", padding: "2px", borderRadius: "4px", cursor: "pointer" }}><CropIcon size={12} /></button>
                                <button type="button" onClick={() => removeImage(url)} style={{ background: "rgba(220,53,69,0.8)", color: "white", border: "none", padding: "2px", borderRadius: "4px", cursor: "pointer" }}><Trash2 size={12} /></button>
                              </div>
                            </div>
                            );
                          })}
                          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "1", border: "2px dashed var(--color-border)", borderRadius: "8px", cursor: "pointer", color: "var(--color-text-muted)" }}>
                            <Upload size={20} />
                            <span style={{ fontSize: "11px", marginTop: "4px" }}>Upload</span>
                            <input type="file" accept="image/*" onChange={handleSelectFile} style={{ display: "none" }} />
                          </label>
                        </div>
                        <p style={{ margin: "0 0 10px", fontSize: "11px", color: "var(--color-text-muted)" }}>
                          Tap the star on an image to make it the storefront image — the one shown on the shop grid, home page and as the main product photo. The rest appear as gallery views.
                        </p>
                        <button type="button" className="btn btn-secondary" onClick={copyImagePrompt} style={{ fontSize: "12px", padding: "6px 12px", justifyContent: "center" }}>
                          Copy Crop AI Prompt
                        </button>
                      </div>

                      {/* Live Preview Card */}
                      <div className="form-card">
                        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>Live Storefront Preview</h4>
                        <div style={{ border: "1px solid var(--color-border)", borderRadius: "12px", overflow: "hidden", backgroundColor: "var(--color-white)" }}>
                          <div style={{ aspectRatio: "4/5", backgroundColor: "#FAF6F4", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            {draft.image_url ? (
                              <img src={draft.image_url} alt="Default preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <span style={{ color: "var(--color-text-muted)" }}>No cover image selected</span>
                            )}
                          </div>
                          <div style={{ padding: "16px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-brand)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{draft.category}</span>
                            <h3 style={{ margin: "4px 0", fontFamily: "var(--font-playfair)", fontSize: "18px" }}>{draft.name || "Product Title"}</h3>
                            <strong style={{ fontSize: "15px" }}>₹{(draft.price_inr || 0).toLocaleString("en-IN")}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="content-header">
                    <div className="content-title">
                      <h2>Product Catalog</h2>
                      <p>Manage all web listings, prices, categories, and inventory status.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowProductForm(true)}>
                      <Plus size={16} /> Add Product
                    </button>
                  </div>

                  <div className="search-filter-row">
                    <div className="search-input-wrap">
                      <Search size={18} />
                      <input type="text" placeholder="Search catalog..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
                    </div>
                  </div>

                  <div className="table-wrapper products-table">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Product Details</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock Status</th>
                          <th>Visibility</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products
                          .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                          .map((product) => (
                            <tr key={product.id}>
                              <td>
                                <div className="product-cell">
                                  <img className="product-thumb" src={product.image_url || "/assets/logos/monogram_ys.png"} alt={product.name} />
                                  <div>
                                    <strong style={{ display: "block" }}>{product.name}</strong>
                                    <small style={{ color: "var(--color-text-muted)" }}>Slug: {product.slug}</small>
                                  </div>
                                </div>
                              </td>
                              <td><span style={{ fontSize: "12px", textTransform: "capitalize" }}>{product.category}</span></td>
                              <td><strong>₹{product.price_inr.toLocaleString("en-IN")}</strong></td>
                              <td>
                                {product.stock_quantity <= 0 ? (
                                  <span style={{ color: "#DC3545", fontWeight: 700 }}>Out of Stock</span>
                                ) : product.stock_quantity <= 5 ? (
                                  <span style={{ color: "#E47E6E", fontWeight: 700 }}>Low Stock ({product.stock_quantity})</span>
                                ) : (
                                  <span style={{ color: "#28A745" }}>{product.stock_quantity} available</span>
                                )}
                              </td>
                              <td>{product.is_active ? <span style={{ color: "#28A745" }}>Active</span> : <span style={{ color: "var(--color-text-muted)" }}>Draft</span>}</td>
                              <td>
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <button
                                    className="btn-icon"
                                    onClick={() => {
                                      setEditingId(product.id);
                                      setDraft({
                                        ...product,
                                        description: product.description ?? "",
                                        image_urls: (() => {
                                          const list = (product.image_urls ?? []).filter(Boolean);
                                          return product.image_url && !list.includes(product.image_url) ? [product.image_url, ...list] : list;
                                        })(),
                                      });
                                      setShowProductForm(true);
                                    }}
                                  >
                                    <Pencil size={15} />
                                  </button>
                                  <button className="btn-icon" style={{ color: "#DC3545" }} onClick={() => deleteProduct(product.id)}>
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Inventory */}
          {currentTab === "inventory" && (
            <div className="split-view-container">
              <div className="split-left">
                <div className="content-header">
                  <div className="content-title">
                    <h2>Stock Inventory</h2>
                    <p>Directly adjust stock quantities, view low stock limits, and monitor availability.</p>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon-wrap"><Package size={24} /></div>
                    <div className="stat-info">
                      <h3>In Stock Items</h3>
                      <p>{products.filter((p) => p.stock_quantity > 5).length}</p>
                    </div>
                  </div>
                  <div className="stat-card" style={{ borderColor: "#F8D7DA" }}>
                    <div className="stat-icon-wrap" style={{ backgroundColor: "#FDEAEB", color: "#DC3545" }}><FolderKanban size={24} /></div>
                    <div className="stat-info">
                      <h3>Low Stock Items</h3>
                      <p>{lowStockCount}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-wrap" style={{ backgroundColor: "#E8ECE9", color: "#6C757D" }}><X size={24} /></div>
                    <div className="stat-info">
                      <h3>Out of Stock</h3>
                      <p>{products.filter((p) => p.stock_quantity <= 0).length}</p>
                    </div>
                  </div>
                </div>

                <div className="search-filter-row">
                  <div className="search-input-wrap">
                    <Search size={18} />
                    <input type="text" placeholder="Search product for stock..." value={inventorySearch} onChange={(e) => setInventorySearch(e.target.value)} />
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product Details</th>
                        <th>Current Stock</th>
                        <th>Status</th>
                        <th>Quick Adjust</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter((p) => p.name.toLowerCase().includes(inventorySearch.toLowerCase()))
                        .map((product) => (
                          <tr key={product.id}>
                            <td>
                              <div className="product-cell">
                                <img className="product-thumb" src={product.image_url || "/assets/logos/monogram_ys.png"} alt={product.name} />
                                <div>
                                  <strong>{product.name}</strong>
                                  <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>{product.category}</div>
                                </div>
                              </div>
                            </td>
                            <td><strong>{product.stock_quantity}</strong></td>
                            <td>
                              {product.stock_quantity <= 0 ? (
                                <span className="badge badge-cancelled">Out of Stock</span>
                              ) : product.stock_quantity <= 5 ? (
                                <span className="badge badge-pending">Low Stock</span>
                              ) : (
                                <span className="badge badge-new">Healthy</span>
                              )}
                            </td>
                            <td>
                              <div className="stepper">
                                <button
                                  className="stepper-btn"
                                  onClick={async () => {
                                    // Update DB stock directly using a simple Supabase call if available, or fetch
                                    // We can just simulate stock update and refresh data
                                    const nextStock = Math.max(0, product.stock_quantity - 1);
                                    // Trigger updateOrderStatus or saveProduct equivalent for stock
                                    // For robustness, we will fetch and update
                                    setMessage("Updating stock...");
                                    const res = await fetch(`/api/upload?action=stock&id=${product.id}&stock=${nextStock}`); // simulated path
                                    // Since we don't have a direct stock api, we can update via supabase if component has access, but standard way:
                                    // We will update product table.
                                    setBusy(true);
                                    if (!supabase) {
                                      setMessage("Supabase client is not loaded.");
                                      setBusy(false);
                                      return;
                                    }
                                    const { error } = await supabase
                                      .from("products")
                                      .update({ stock_quantity: nextStock })
                                      .eq("id", product.id);
                                    setBusy(false);
                                    if (!error) await loadData();
                                    setMessage(error ? error.message : `Stock for ${product.name} updated to ${nextStock}`);
                                  }}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={product.stock_quantity}
                                  onChange={async (e) => {
                                    const nextStock = Math.max(0, parseInt(e.target.value) || 0);
                                    setBusy(true);
                                    if (!supabase) {
                                      setMessage("Supabase client is not loaded.");
                                      setBusy(false);
                                      return;
                                    }
                                    const { error } = await supabase
                                      .from("products")
                                      .update({ stock_quantity: nextStock })
                                      .eq("id", product.id);
                                    setBusy(false);
                                    if (!error) await loadData();
                                    setMessage(error ? error.message : `Stock for ${product.name} updated to ${nextStock}`);
                                  }}
                                  className="stepper-val"
                                  style={{
                                    width: "48px",
                                    border: "none",
                                    textAlign: "center",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    outline: "none",
                                    background: "transparent",
                                    padding: 0,
                                    margin: 0,
                                  }}
                                />
                                <button
                                  className="stepper-btn"
                                  onClick={async () => {
                                    const nextStock = product.stock_quantity + 1;
                                    setBusy(true);
                                    if (!supabase) {
                                      setMessage("Supabase client is not loaded.");
                                      setBusy(false);
                                      return;
                                    }
                                    const { error } = await supabase
                                      .from("products")
                                      .update({ stock_quantity: nextStock })
                                      .eq("id", product.id);
                                    setBusy(false);
                                    if (!error) await loadData();
                                    setMessage(error ? error.message : `Stock for ${product.name} updated to ${nextStock}`);
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Alerts sidebar */}
              <div className="split-right" style={{ width: "300px" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-playfair)", fontSize: "18px" }}>Alerts</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {products.filter((p) => p.stock_quantity <= 5).map((p) => (
                    <div key={p.id} style={{ display: "flex", gap: "10px", padding: "12px", border: "1px solid #F8D7DA", borderRadius: "8px", backgroundColor: "#FDEAEB" }}>
                      <FolderKanban size={18} style={{ color: "#DC3545", flexShrink: 0 }} />
                      <div>
                        <strong style={{ fontSize: "13px", display: "block" }}>{p.name}</strong>
                        <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>Stock is critical: {p.stock_quantity} left</span>
                      </div>
                    </div>
                  ))}
                  {products.filter((p) => p.stock_quantity <= 5).length === 0 && (
                    <p style={{ fontStyle: "italic", color: "var(--color-text-muted)" }}>No low stock alerts</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Media Library */}
          {currentTab === "media-library" && (
            <div className="split-view-container">
              <div className="split-left">
                <div className="content-header">
                  <div className="content-title">
                    <h2>Media Library</h2>
                    <p>View and manage all uploaded product photo assets stored on Google Cloud Storage.</p>
                  </div>
                </div>

                <div className="media-grid">
                  {getAllMedia().map((url, idx) => (
                    <div key={idx} className={`media-card ${selectedMediaUrl === url ? "selected" : ""}`} onClick={() => setSelectedMediaUrl(url)}>
                      <div className="media-img-wrap">
                        <img src={url} alt={`Asset ${idx}`} />
                      </div>
                      <div className="media-info">
                        <div className="media-title">{url.split("/").pop() || `Photo ${idx}`}</div>
                        <div className="media-meta">Google Cloud GCS</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMediaUrl && (
                <div className="split-right" style={{ width: "300px" }}>
                  <div className="detail-header">
                    <h3 style={{ margin: 0, fontFamily: "var(--font-playfair)", fontSize: "16px" }}>Asset Metadata</h3>
                    <button onClick={() => setSelectedMediaUrl(null)} className="btn-icon"><X size={16} /></button>
                  </div>
                  <div style={{ aspectRatio: "1", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--color-border)", marginBottom: "16px" }}>
                    <img src={selectedMediaUrl} alt="Selected metadata preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div className="detail-row" style={{ flexDirection: "column", gap: "4px" }}>
                    <span>URL Path:</span>
                    <strong style={{ fontSize: "11px", wordBreak: "break-all" }}>{selectedMediaUrl}</strong>
                  </div>
                  <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                    <button className="btn btn-secondary" style={{ flexGrow: 1 }} onClick={() => handleAdjustCrop(selectedMediaUrl)}>
                      <CropIcon size={14} /> Recrop Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Shipping */}
          {currentTab === "shipping" && (
            <div>
              <div className="content-header">
                <div className="content-title">
                  <h2>Shipping & Fulfilment</h2>
                  <p>Manage order dispatch status, coordinate pickups, and record tracking identifiers.</p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="stats-grid" style={{ marginBottom: "24px" }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "#FFE8D6", color: "#A7523E" }}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <span className="stat-label">Awaiting Pickup Request</span>
                    <strong className="stat-value">
                      {orders.filter((o) => ["paid", "making"].includes(o.status.toLowerCase()) && o.pickup_status === "not_requested").length}
                    </strong>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "#FFEBEB", color: "#DC3545" }}>
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <span className="stat-label">Pending Pickups</span>
                    <strong className="stat-value">
                      {orders.filter((o) => o.pickup_status === "requested").length}
                    </strong>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "#E8F5E9", color: "#2E7D32" }}>
                    <Package size={20} />
                  </div>
                  <div>
                    <span className="stat-label">Total Shipped / Completed</span>
                    <strong className="stat-value">
                      {orders.filter((o) => ["shipped", "completed"].includes(o.status.toLowerCase())).length}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Shipping Table */}
              <div className="form-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                  <h3 style={{ margin: 0, fontFamily: "var(--font-playfair)", fontSize: "18px" }}>Parcels Fulfilment</h3>
                  <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                    Showing orders requiring dispatch
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Address</th>
                        <th>Pickup</th>
                        <th>Carrier / AWB</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter((o) => !["new", "contacted", "payment_pending", "cancelled"].includes(o.status.toLowerCase()))
                        .map((order) => {
                          const isAwaiting = order.pickup_status === "not_requested";
                          const isRequested = order.pickup_status === "requested";
                          const isPickedUp = order.pickup_status === "picked_up";
                          
                          return (
                            <tr key={order.id} style={{ cursor: "pointer" }} onClick={() => { setSelectedOrder(order); setSelectedOrderRequest(null); setSelectedInquiry(null); }}>
                              <td>
                                <strong>#{order.id}</strong>
                                <span className="badge" style={{ display: "block", width: "fit-content", marginTop: "4px", fontSize: "10px", padding: "2px 6px" }}>
                                  {order.status.replace("_", " ")}
                                </span>
                              </td>
                              <td>
                                <div><strong>{order.customer_name}</strong></div>
                                <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{order.customer_phone}</div>
                              </td>
                              <td style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {order.delivery_address}
                              </td>
                              <td>
                                {isAwaiting && <span className="badge badge-pending">Not Requested</span>}
                                {isRequested && <span className="badge badge-new">Requested</span>}
                                {isPickedUp && <span className="badge badge-completed">Picked Up</span>}
                              </td>
                              <td>
                                {order.awb_code ? (
                                  <div>
                                    <strong>{order.courier_name || "Courier"}</strong>
                                    <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>{order.awb_code}</div>
                                  </div>
                                ) : (
                                  <span style={{ fontStyle: "italic", fontSize: "12px", color: "var(--color-text-muted)" }}>No tracking code</span>
                                )}
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                                  {isAwaiting && (
                                    <button
                                      className="btn btn-primary"
                                      style={{ fontSize: "12px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "4px" }}
                                      onClick={async () => {
                                        setBusy(true);
                                        const { error } = await supabase!
                                          .from("orders")
                                          .update({
                                            pickup_status: "requested",
                                            pickup_requested_at: new Date().toISOString()
                                          })
                                          .eq("id", order.id);
                                        setBusy(false);
                                        if (error) setMessage(error.message);
                                        else {
                                          setMessage(`Order #${order.id} marked for pickup.`);
                                          await loadData();
                                        }
                                      }}
                                    >
                                      <Truck size={12} /> Request Pickup
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-secondary"
                                    style={{ fontSize: "12px", padding: "6px 10px" }}
                                    onClick={() => { setSelectedOrder(order); setSelectedOrderRequest(null); setSelectedInquiry(null); }}
                                  >
                                    <Eye size={12} /> Details
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {orders.filter((o) => !["new", "contacted", "payment_pending", "cancelled"].includes(o.status.toLowerCase())).length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: "center", padding: "30px", color: "var(--color-text-muted)" }}>
                            No active orders require shipping at this time.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Settings */}
          {currentTab === "settings" && (
            <div style={{ maxWidth: "700px" }}>
              <div className="content-header">
                <div className="content-title">
                  <h2>Store Settings</h2>
                  <p>Configure product categories, Instagram links, and global boutique metadata.</p>
                </div>
              </div>

              <div className="form-card" style={{ marginBottom: "24px" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-playfair)", fontSize: "18px" }}>Instagram Feed Config</h3>
                <p style={{ fontSize: "13px", color: "var(--color-text-muted)", margin: "4px 0 16px 0" }}>Add Post or Reel URLs. These show up dynamically on the Behind the Loops section of the webapp.</p>
                <form onSubmit={saveInstagramLinks} className="links-form" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {instagramLinks.map((link, index) => (
                    <div key={index} style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="url"
                        value={link}
                        className="filter-select"
                        style={{ flexGrow: 1 }}
                        placeholder="https://www.instagram.com/p/..."
                        onChange={(e) => {
                          const next = [...instagramLinks];
                          next[index] = e.target.value;
                          setInstagramLinks(next);
                        }}
                      />
                      <button
                        type="button"
                        className="btn-icon"
                        style={{ color: "#DC3545" }}
                        onClick={() => {
                          const next = instagramLinks.filter((_, idx) => idx !== index);
                          setInstagramLinks(next);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary" style={{ justifyContent: "center" }} onClick={() => setInstagramLinks((current) => [...current, ""])}>
                    <Plus size={16} /> Add Link Row
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ justifyContent: "center" }}>
                    Save Instagram Links
                  </button>
                </form>
              </div>

              <div className="form-card">
                <h3 style={{ margin: 0, fontFamily: "var(--font-playfair)", fontSize: "18px" }}>Product Categories</h3>
                <p style={{ fontSize: "13px", color: "var(--color-text-muted)", margin: "4px 0 16px 0" }}>Create new tags for catalog organization.</p>
                <form onSubmit={addCategory} style={{ display: "flex", gap: "12px" }}>
                  <input type="text" className="filter-select" style={{ flexGrow: 1 }} value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Dreamcatchers" />
                  <button type="submit" className="btn btn-primary">Add Category</button>
                </form>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
                  {categories.map((c) => (
                    <span key={c} style={{ padding: "6px 12px", background: "#FAF6F4", borderRadius: "16px", fontSize: "13px", fontWeight: 600, border: "1px solid var(--color-border)" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
