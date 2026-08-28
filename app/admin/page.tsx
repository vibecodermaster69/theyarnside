"use client";

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ChevronRight,
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
  ChevronLeft,
} from "lucide-react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import AdminDashboard from "./components/AdminDashboard";
import "./components/AdminDashboard.css";

async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(new File([blob], fileName, { type: "image/jpeg" }));
      },
      "image/jpeg",
      1
    );
  });
}

const defaultCategories = [
  "amigurumi",
  "wearables",
  "home-decor",
  "accessories-gifts",
  "hair-fashion-accessories",
  "keychains-charms",
];

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
  color_variants: ColorVariant[];
  is_new: boolean;
  is_best_seller: boolean;
  is_active: boolean;
};

type ColorVariant = { name: string; hex: string; stockQuantity: number; imageUrl?: string };

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

const orderStatuses = [
  "new",
  "contacted",
  "payment_pending",
  "paid",
  "making",
  "shipped",
  "completed",
  "cancelled",
];
const imagePrompt =
  "Resize and crop this handmade crochet product photo for an ecommerce product card. Keep the product fully visible and centered, preserve its real colors and crochet texture, use a clean warm cream background, and produce a high-quality 4:5 portrait image at exactly 1200 x 1500 pixels. Do not add text, logos, borders, props, or watermarks. Avoid stretching the product; use natural padding where needed.";

const emptyProduct: ProductDraft = {
  name: "",
  slug: "",
  description: "",
  category: "amigurumi",
  price_inr: 0,
  image_url: "",
  image_urls: [],
  dimensions: "",
  weight_grams: null,
  stock_quantity: 0,
  color_variants: [],
  is_new: true,
  is_best_seller: false,
  is_active: true,
};

export default function AdminPage() {
  const [supabase, setSupabase] = useState<ReturnType<
    typeof createSupabaseBrowserClient
  > | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(emptyProduct);
  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [instagramLinks, setInstagramLinks] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentTab, setCurrentTab] = useState<
    "dashboard" | "orders" | "products" | "inventory" | "shipping" | "customers" | "media-library" | "categories" | "collections" | "discounts" | "settings"
  >("dashboard");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderRequest, setSelectedOrderRequest] = useState<OrderRequest | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Cropper state
  const [imageToReplace, setImageToReplace] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    try {
      setSupabase(createSupabaseBrowserClient());
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Supabase is not configured.",
      );
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSessionEmail(nextSession?.user.email ?? null);
      },
    );

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
    const [
      { data: productRows, error: productError },
      { data: settingRow },
      { data: categorySetting },
      { data: orderRows, error: orderError },
      { data: requestRows, error: requestError },
      { data: inquiryRows, error: inquiryError },
    ] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("site_settings")
        .select("value")
        .eq("key", "instagram_links")
        .maybeSingle(),
      supabase
        .from("site_settings")
        .select("value")
        .eq("key", "product_categories")
        .maybeSingle(),
      supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false }),
      supabase
        .from("order_requests")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (productError) {
      setMessage(productError.message);
      return;
    }

    setProducts((productRows ?? []) as Product[]);
    if (!orderError) {
      const freshOrders = (orderRows ?? []) as Order[];
      setOrders(freshOrders);
      setSelectedOrder((current) => {
        if (!current) return null;
        return freshOrders.find((o) => o.id === current.id) || null;
      });
    }
    if (!requestError) {
      const freshRequests = (requestRows ?? []) as OrderRequest[];
      setOrderRequests(freshRequests);
      setSelectedOrderRequest((current) => {
        if (!current) return null;
        return freshRequests.find((r) => r.id === current.id) || null;
      });
    }
    if (!inquiryError) {
      const freshInquiries = (inquiryRows ?? []) as Inquiry[];
      setInquiries(freshInquiries);
      setSelectedInquiry((current) => {
        if (!current) return null;
        return freshInquiries.find((i) => i.id === current.id) || null;
      });
    }
    const links = settingRow?.value;
    setInstagramLinks(
      Array.isArray(links)
        ? links.filter((link): link is string => typeof link === "string")
        : [],
    );
    const savedCategories = categorySetting?.value;
    if (Array.isArray(savedCategories)) {
      setCategories(
        Array.from(
          new Set([
            ...defaultCategories,
            ...savedCategories.filter(
              (category): category is string => typeof category === "string",
            ),
          ]),
        ),
      );
    }
  }

  async function signIn(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setMessage(error ? error.message : "Signed in successfully.");
    setBusy(false);
  }

  async function authHeaders() {
    const token = (await supabase?.auth.getSession())?.data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }

  // Supabase writes happen straight from the browser, so Next never learns the
  // catalogue changed and keeps serving cached pages (and deleted images).
  async function purgeStorefrontCache() {
    const headers = await authHeaders();
    if (!headers) return;
    try {
      await fetch("/api/revalidate", { method: "POST", headers });
    } catch {
      // A failed purge only means the storefront lags until its 60s window ends.
    }
  }

  async function deleteStoredImage(url: string) {
    const headers = await authHeaders();
    if (!headers || !url.startsWith("https://storage.googleapis.com/")) return;
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } catch {
      // Leaving an orphaned object is preferable to blocking the edit.
    }
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const payload = {
      ...draft,
      image_urls: draft.image_urls ?? [],
      price_inr: Number(draft.price_inr),
      color_variants: draft.color_variants ?? [],
      stock_quantity: draft.color_variants?.length
        ? draft.color_variants.reduce((total, variant) => total + Math.max(0, Number(variant.stockQuantity) || 0), 0)
        : Number(draft.stock_quantity),
      weight_grams:
        draft.weight_grams == null ? null : Number(draft.weight_grams),
    };
    const result = editingId
      ? await supabase.from("products").update(payload).eq("id", editingId)
      : await supabase.from("products").insert(payload);

    setMessage(result.error ? result.error.message : "Product saved.");
    if (!result.error) {
      setDraft(emptyProduct);
      setEditingId(null);
      await purgeStorefrontCache();
      await loadData();
    }
    setBusy(false);
  }

  async function addCategory(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    const slug = newCategory
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) {
      setMessage("Enter a category name first.");
      return;
    }
    if (categories.includes(slug)) {
      setMessage("That category already exists.");
      return;
    }
    setBusy(true);
    const nextCategories = [...categories, slug];
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "product_categories", value: nextCategories });
    setMessage(error ? error.message : "Category added.");
    if (!error) {
      setCategories(nextCategories);
      setDraft((current) => ({ ...current, category: slug }));
      setNewCategory("");
    }
    setBusy(false);
  }

  async function deleteProduct(id: number) {
    if (!supabase) return;
    setConfirmConfig({
      message: "Delete this product?",
      onConfirm: async () => {
        setBusy(true);
        const { error } = await supabase.from("products").delete().eq("id", id);
        setMessage(error ? error.message : "Product deleted.");
        if (!error) {
          await purgeStorefrontCache();
          await loadData();
        }
        setBusy(false);
      },
    });
  }

  async function saveInstagramLinks(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const links = instagramLinks.map((link) => link.trim()).filter(Boolean);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "instagram_links", value: links });
    setMessage(error ? error.message : "Instagram links saved.");
    setInstagramLinks(links);
    setBusy(false);
  }

  async function updateOrderStatus(orderId: number, nextStatus: string) {
    if (!supabase) return;
    if (nextStatus === "cancelled") {
      setConfirmConfig({
        message: `Cancel order #${orderId} and add its items back to stock?`,
        onConfirm: async () => {
          setBusy(true);
          const { error } = await supabase.rpc("cancel_order", {
            p_order_id: orderId,
          });
          setMessage(
            error
              ? error.message
              : `Order #${orderId} cancelled and stock restored.`,
          );
          if (!error) await loadData();
          setBusy(false);
        },
      });
      return;
    }
    const { error } = await supabase
      .from("orders")
      .update({ status: nextStatus })
      .eq("id", orderId);
    setMessage(error ? error.message : `Order #${orderId} updated.`);
    if (!error) {
      setOrders(
        orders.map((item) =>
          item.id === orderId ? { ...item, status: nextStatus } : item,
        ),
      );
      setSelectedOrder((current) => {
        if (current && current.id === orderId) {
          return { ...current, status: nextStatus };
        }
        return current;
      });
    }
  }



  async function updateRequestStatus(requestId: number, nextStatus: string) {
    if (!supabase) return;
    const { error } = await supabase
      .from("order_requests")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", requestId);
    setMessage(error ? error.message : `Request #${requestId} marked ${nextStatus.replaceAll("_", " ")}.`);
    if (error) return;
    setOrderRequests((current) =>
      current.map((item) =>
        item.id === requestId ? { ...item, status: nextStatus } : item,
      ),
    );
    setSelectedOrderRequest((current) =>
      current && current.id === requestId
        ? { ...current, status: nextStatus }
        : current,
    );
  }

  async function updateInquiryStatus(inquiryId: number, nextStatus: string) {
    if (!supabase) return;
    const { error } = await supabase
      .from("inquiries")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", inquiryId);
    setMessage(error ? error.message : `Inquiry #${inquiryId} marked ${nextStatus.replaceAll("_", " ")}.`);
    if (error) return;
    setInquiries((current) =>
      current.map((item) =>
        item.id === inquiryId ? { ...item, status: nextStatus } : item,
      ),
    );
    setSelectedInquiry((current) =>
      current && current.id === inquiryId
        ? { ...current, status: nextStatus }
        : current,
    );
  }

  function handleSelectFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const invalid = !file.type.startsWith("image/");
      if (invalid) {
        setMessage("Please choose a valid image file.");
        return;
      }
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setCropSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(file);
      event.target.value = "";
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const cropConfig = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        4 / 5,
        width,
        height
      ),
      width,
      height
    );
    setCrop(cropConfig);
  }

  async function handleConfirmCrop() {
    if (!imgRef.current || !completedCrop) return;
    try {
      setUploadingImage(true);
      setMessage("Cropping and uploading...");
      const file = await getCroppedImg(imgRef.current, completedCrop, "cropped.jpg");
      setCropSrc("");
      
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      const data = await response.json();
      const newUrl = data.url;

      setDraft((current) => {
        let newUrls = [...(current.image_urls ?? [])];
        let newDefaultUrl = current.image_url;
        
        if (imageToReplace) {
          void deleteStoredImage(imageToReplace);
          newUrls = newUrls.map((u) => (u === imageToReplace ? newUrl : u));
          if (newDefaultUrl === imageToReplace) {
            newDefaultUrl = newUrl;
          }
        } else {
          newUrls.push(newUrl);
          if (!newDefaultUrl) {
            newDefaultUrl = newUrl;
          }
        }

        return {
          ...current,
          image_url: newDefaultUrl,
          image_urls: newUrls,
        };
      });

      setImageToReplace(null);
      setMessage("Image uploaded successfully!");
      setUploadingImage(false);
    } catch (e) {
      setMessage(`Crop/Upload failed: ${(e as Error).message}`);
      setUploadingImage(false);
    }
  }

  async function handleAdjustCrop(url: string) {
    try {
      setMessage("Loading image for cropping...");
      const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error("Failed to load image");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageToReplace(url);
      setCrop(undefined);
      setCropSrc(objectUrl);
      setMessage("");
    } catch (e) {
      setMessage(`Could not load image: ${(e as Error).message}`);
    }
  }

  function removeImage(urlToRemove: string) {
    void deleteStoredImage(urlToRemove);
    setDraft((current) => {
      const newUrls = (current.image_urls ?? []).filter((url) => url !== urlToRemove);
      let newDefaultUrl = current.image_url;
      
      // If the removed image was the default, pick the next available one or empty
      if (current.image_url === urlToRemove) {
        newDefaultUrl = newUrls.length > 0 ? newUrls[0] : "";
      }
      
      return {
        ...current,
        image_urls: newUrls,
        image_url: newDefaultUrl,
      };
    });
  }

  function withCoverImage(urls: string[] | null, cover: string | null) {
    const list = Array.isArray(urls) ? urls.filter(Boolean) : [];
    // Legacy rows can carry a cover image that never made it into the gallery
    // array; include it so it stays selectable in the images grid.
    if (cover && !list.includes(cover)) return [cover, ...list];
    return list;
  }

  function setDefaultImage(urlToFeature: string) {
    setDraft((current) => {
      if (!(current.image_urls ?? []).includes(urlToFeature)) return current;
      return { ...current, image_url: urlToFeature };
    });
    setMessage("Storefront image updated. Remember to save the listing.");
  }

  async function copyImagePrompt() {
    await navigator.clipboard.writeText(imagePrompt);
    setMessage("Image resizing prompt copied.");
  }

  function downloadOrderRequests() {
    const headers = [
      "Request ID",
      "Created",
      "Product",
      "Quantity",
      "Customer",
      "Phone",
      "Shipping Address",
      "Budget INR",
      "Timeframe",
      "Notes",
      "Status",
    ];
    const escapeCell = (value: string | number | null) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = orderRequests.map((request) => [
      request.id,
      new Date(request.created_at).toLocaleString("en-IN"),
      request.product_name,
      request.quantity,
      request.customer_name,
      request.phone,
      request.shipping_address,
      request.budget_inr,
      request.timeframe.replaceAll("_", " "),
      request.notes,
      request.status,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }),
    );
    link.download = `theyarnside-order-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function renderProductRows(items: Product[]) {
    return items.map((product) => (
      <article className="product-row" key={product.id}>
        <div>
          <strong>{product.name}</strong>
          <span>
            {product.category} · ₹{product.price_inr.toLocaleString("en-IN")} ·{" "}
            {product.stock_quantity} in stock
          </span>
        </div>
        <div className="row-actions">
          <button
            aria-label={`Edit ${product.name}`}
            onClick={() => {
              setEditingId(product.id);
              setDraft({
                ...product,
                description: product.description ?? "",
                image_url: product.image_url ?? "",
                image_urls: withCoverImage(
                  product.image_urls,
                  product.image_url,
                ),
                dimensions: product.dimensions ?? "",
                weight_grams: product.weight_grams ?? null,
                color_variants: product.color_variants ?? [],
              });
            }}
          >
            <Pencil size={16} />
          </button>
          <button
            aria-label={`Delete ${product.name}`}
            onClick={() => deleteProduct(product.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </article>
    ));
  }

  if (!sessionEmail) {
    return (
      <main className="admin-page">
        <section className="admin-login">
          <p className="admin-eyebrow">THE YARN SIDE</p>
          <h1>Admin sign in</h1>
          <p>Manage products, prices, stock, and Instagram links.</p>
          <form onSubmit={signIn}>
            <label>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <button type="submit" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>
          {message && <p className="admin-message">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <AdminDashboard
      products={products}
      orders={orders}
      orderRequests={orderRequests}
      inquiries={inquiries}
      selectedInquiry={selectedInquiry}
      setSelectedInquiry={setSelectedInquiry}
      updateRequestStatus={updateRequestStatus}
      updateInquiryStatus={updateInquiryStatus}
      categories={categories}
      instagramLinks={instagramLinks}
      message={message}
      busy={busy}
      uploadingImage={uploadingImage}
      sessionEmail={sessionEmail}
      editingId={editingId}
      draft={draft}
      newCategory={newCategory}
      currentTab={currentTab}
      selectedOrder={selectedOrder}
      selectedOrderRequest={selectedOrderRequest}
      productSearch={productSearch}
      orderSearch={orderSearch}
      inventorySearch={inventorySearch}
      showProductForm={showProductForm}
      selectedMediaUrl={selectedMediaUrl}
      cropSrc={cropSrc}
      crop={crop}
      completedCrop={completedCrop}
      imgRef={imgRef}
      imageToReplace={imageToReplace}
      setCurrentTab={setCurrentTab}
      setSelectedOrder={setSelectedOrder}
      setSelectedOrderRequest={setSelectedOrderRequest}
      setProductSearch={setProductSearch}
      setOrderSearch={setOrderSearch}
      setInventorySearch={setInventorySearch}
      setShowProductForm={setShowProductForm}
      setSelectedMediaUrl={setSelectedMediaUrl}
      setDraft={setDraft}
      setEditingId={setEditingId}
      setNewCategory={setNewCategory}
      setInstagramLinks={setInstagramLinks}
      setMessage={setMessage}
      setBusy={setBusy}
      setUploadingImage={setUploadingImage}
      loadData={loadData}
      saveProduct={saveProduct}
      addCategory={addCategory}
      deleteProduct={deleteProduct}
      saveInstagramLinks={saveInstagramLinks}
      updateOrderStatus={updateOrderStatus}
      handleSelectFile={handleSelectFile}
      onImageLoad={onImageLoad}
      handleConfirmCrop={handleConfirmCrop}
      handleAdjustCrop={handleAdjustCrop}
      removeImage={removeImage}
      setDefaultImage={setDefaultImage}
      copyImagePrompt={copyImagePrompt}
      downloadOrderRequests={downloadOrderRequests}
      signOut={() => supabase?.auth.signOut()}
      setCrop={setCrop}
      setCompletedCrop={setCompletedCrop}
      setCropSrc={setCropSrc}
      confirmConfig={confirmConfig}
      setConfirmConfig={setConfirmConfig}
      supabase={supabase}
    />
  );
}
