"use client";

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
} from "lucide-react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { createSupabaseBrowserClient } from "@/lib/supabase";

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
  order_items?: OrderItem[];
};

type OrderItem = {
  id: number;
  product_name: string;
  quantity: number;
  unit_price_inr: number;
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
const requestStatuses = [
  "new",
  "contacted",
  "accepted",
  "declined",
  "completed",
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
  is_new: true,
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
  const [draft, setDraft] = useState<ProductDraft>(emptyProduct);
  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [instagramLinks, setInstagramLinks] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    ]);

    if (productError) {
      setMessage(productError.message);
      return;
    }

    setProducts((productRows ?? []) as Product[]);
    if (!orderError) setOrders((orderRows ?? []) as Order[]);
    if (!requestError) setOrderRequests((requestRows ?? []) as OrderRequest[]);
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

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const payload = {
      ...draft,
      image_urls: draft.image_urls ?? [],
      price_inr: Number(draft.price_inr),
      stock_quantity: Number(draft.stock_quantity),
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
      if (
        !window.confirm(
          `Cancel order #${orderId} and add its items back to stock?`,
        )
      )
        return;
      const { error } = await supabase.rpc("cancel_order", {
        p_order_id: orderId,
      });
      setMessage(
        error
          ? error.message
          : `Order #${orderId} cancelled and stock restored.`,
      );
      if (!error) await loadData();
      return;
    }
    const { error } = await supabase
      .from("orders")
      .update({ status: nextStatus })
      .eq("id", orderId);
    setMessage(error ? error.message : `Order #${orderId} updated.`);
    if (!error)
      setOrders(
        orders.map((item) =>
          item.id === orderId ? { ...item, status: nextStatus } : item,
        ),
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
                image_urls:
                  product.image_urls ??
                  (product.image_url ? [product.image_url] : []),
                dimensions: product.dimensions ?? "",
                weight_grams: product.weight_grams ?? null,
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
        <AdminStyles />
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">THE YARN SIDE</p>
            <h1>Store admin</h1>
            <p>{sessionEmail}</p>
          </div>
          <div className="admin-header-actions">
            <Link className="admin-orders-tab" href="/admin/orders">
              <span className="admin-orders-icon">
                <ClipboardList size={21} />
              </span>
              <span className="admin-orders-copy">
                <strong>Orders</strong>
                <small>Manage fulfilment</small>
              </span>
              <span className="admin-orders-count">
                {orders.length + orderRequests.length}
              </span>
              <ChevronRight className="admin-orders-arrow" size={18} />
            </Link>
            <button
              className="secondary-button"
              onClick={loadData}
              disabled={busy}
            >
              <RefreshCw size={16} /> Refresh data
            </button>
            <button
              className="secondary-button"
              onClick={() => supabase?.auth.signOut()}
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </header>
        {message && <p className="admin-message">{message}</p>}

        <section className="admin-section">
          <div className="section-heading">
            <div>
              <p className="admin-eyebrow">CATALOGUE</p>
              <h2>{editingId ? "Edit product" : "Add product"}</h2>
            </div>
            {editingId && (
              <button
                className="secondary-button"
                onClick={() => {
                  setDraft(emptyProduct);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
          <form className="category-form" onSubmit={addCategory}>
            <label>
              New category name
              <input
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="e.g. Baby Blankets"
              />
            </label>
            <button type="submit" disabled={busy}>
              <Plus size={16} /> Create category
            </button>
          </form>
          <form className="product-form" onSubmit={saveProduct}>
            <label>
              Product name
              <input
                required
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>
            <label>
              Slug
              <input
                required
                value={draft.slug}
                onChange={(event) =>
                  setDraft({ ...draft, slug: event.target.value })
                }
                placeholder="daisy-market-tote"
              />
            </label>
            <label>
              Category
              <select
                value={draft.category}
                onChange={(event) =>
                  setDraft({ ...draft, category: event.target.value })
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Price (INR)
              <input
                type="number"
                min="0"
                required
                value={draft.price_inr}
                onChange={(event) =>
                  setDraft({ ...draft, price_inr: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Stock quantity
              <input
                type="number"
                min="0"
                required
                value={draft.stock_quantity}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    stock_quantity: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Dimensions (L × W × H)
              <input
                value={draft.dimensions ?? ""}
                onChange={(event) =>
                  setDraft({ ...draft, dimensions: event.target.value })
                }
                placeholder="e.g. 25 × 18 × 8 cm"
              />
            </label>
            <label>
              Weight (grams)
              <input
                type="number"
                min="0"
                value={draft.weight_grams ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    weight_grams:
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                  })
                }
                placeholder="e.g. 450"
              />
            </label>
            <div className="image-upload-field wide">
              {cropSrc ? (
                <div className="cropper-container">
                  <p className="preview-label">Crop your image (4:5 ratio)</p>
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={4 / 5}
                    className="cropper-wrap"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={cropSrc}
                      onLoad={onImageLoad}
                      className="cropper-img"
                    />
                  </ReactCrop>
                  <div className="cropper-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setCropSrc("");
                        setImageToReplace(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleConfirmCrop}
                      disabled={uploadingImage}
                    >
                      <CropIcon size={16} style={{ marginRight: 6 }} />
                      {uploadingImage ? "Uploading..." : "Confirm & Upload"}
                    </button>
                  </div>
                </div>
              ) : (
                <label className="add-image-button">
                  <span>{uploadingImage ? "Uploading image..." : "+ Add image"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleSelectFile}
                    disabled={uploadingImage}
                  />
                </label>
              )}
              {!!draft.image_urls?.length && (
                <div className="image-gallery-editor">
                  <p className="preview-label">
                    Product gallery · choose the default image
                  </p>
                  <div className="image-gallery-grid">
                    {draft.image_urls.map((url, index) => (
                      <div className="gallery-image-wrapper" key={`${url}-${index}`}>
                        <button
                          type="button"
                          className={`gallery-image-option ${draft.image_url === url ? "selected" : ""}`}
                          onClick={() => setDraft({ ...draft, image_url: url })}
                        >
                          <img src={url} alt={`Product angle ${index + 1}`} />
                          <span>
                            {draft.image_url === url
                              ? "Default image"
                              : "Use as default"}
                          </span>
                        </button>
                        <div className="gallery-image-actions">
                          <button 
                            type="button" 
                            className="gallery-image-action edit"
                            onClick={() => handleAdjustCrop(url)}
                            aria-label="Adjust crop"
                          >
                            <CropIcon size={14} />
                          </button>
                          <button 
                            type="button" 
                            className="gallery-image-action delete"
                            onClick={() => removeImage(url)}
                            aria-label="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="field-help">
                Recommended: 4:5 portrait ratio, exactly 1200 × 1500 px,
                JPG/PNG/WebP.
              </p>
              {draft.image_url && (
                <div className="product-preview">
                  <p className="preview-label">Storefront preview</p>
                  <div className="preview-card">
                    <div className="preview-image-wrap">
                      <img src={draft.image_url} alt="Product preview" />
                    </div>
                    <div className="preview-info">
                      <span>
                        {categories.find(
                          (category) => category === draft.category,
                        ) || draft.category}
                      </span>
                      <strong>{draft.name || "Product name"}</strong>
                      <b>
                        ₹{Number(draft.price_inr || 0).toLocaleString("en-IN")}
                      </b>
                    </div>
                  </div>
                  <p className="field-help">
                    This uses the same 4:5 crop and card proportions as the shop
                    and New Arrivals pages.
                  </p>
                </div>
              )}
              <label>
                Image URL fallback
                <input
                  value={draft.image_url ?? ""}
                  onChange={(event) =>
                    setDraft({ ...draft, image_url: event.target.value })
                  }
                  placeholder="/assets/... or https://..."
                />
              </label>
              <div className="prompt-box">
                <div>
                  <strong>AI resizing prompt</strong>
                  <p>{imagePrompt}</p>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={copyImagePrompt}
                >
                  <Copy size={15} /> Copy prompt
                </button>
              </div>
            </div>
            <label className="wide">
              Description
              <textarea
                rows={3}
                value={draft.description ?? ""}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
              />
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={draft.is_new}
                onChange={(event) =>
                  setDraft({ ...draft, is_new: event.target.checked })
                }
              />{" "}
              Show as new
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={draft.is_active}
                onChange={(event) =>
                  setDraft({ ...draft, is_active: event.target.checked })
                }
              />{" "}
              Visible on website
            </label>
            <button type="submit" disabled={busy || uploadingImage}>
              <Save size={16} /> {editingId ? "Update product" : "Add product"}
            </button>
          </form>
          <div className="product-groups">
            <div className="product-group">
              <h3>
                New arrivals{" "}
                <span>
                  {products.filter((product) => product.is_new).length}
                </span>
              </h3>
              {products.filter((product) => product.is_new).length ? (
                <div className="product-list">
                  {renderProductRows(
                    products.filter((product) => product.is_new),
                  )}
                </div>
              ) : (
                <p>No products marked as new.</p>
              )}
            </div>
            <div className="product-group">
              <h3>
                Other web products{" "}
                <span>
                  {products.filter((product) => !product.is_new).length}
                </span>
              </h3>
              {products.filter((product) => !product.is_new).length ? (
                <div className="product-list">
                  {renderProductRows(
                    products.filter((product) => !product.is_new),
                  )}
                </div>
              ) : (
                <p>No other products listed.</p>
              )}
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="section-heading">
            <div>
              <p className="admin-eyebrow">MADE TO ORDER</p>
              <h2>Request orders</h2>
            </div>
            <button
              className="secondary-button"
              onClick={downloadOrderRequests}
              disabled={!orderRequests.length}
            >
              Download Excel CSV
            </button>
          </div>
          {!orderRequests.length ? (
            <p>No request orders yet.</p>
          ) : (
            <div className="order-list">
              {orderRequests.map((request) => (
                <article className="order-card" key={request.id}>
                  <div className="order-card-header">
                    <div>
                      <strong>
                        Request #{request.id} · {request.product_name}
                      </strong>
                      <span>
                        {new Date(request.created_at).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <select
                      value={request.status}
                      onChange={async (event) => {
                        if (!supabase) return;
                        const nextStatus = event.target.value;
                        const { error } = await supabase
                          .from("order_requests")
                          .update({ status: nextStatus })
                          .eq("id", request.id);
                        setMessage(
                          error
                            ? error.message
                            : `Request #${request.id} updated.`,
                        );
                        if (!error)
                          setOrderRequests(
                            orderRequests.map((item) =>
                              item.id === request.id
                                ? { ...item, status: nextStatus }
                                : item,
                            ),
                          );
                      }}
                    >
                      {requestStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p>
                    <strong>{request.customer_name}</strong> · {request.phone} ·
                    Quantity: {request.quantity}
                  </p>
                  <p>{request.shipping_address}</p>
                  <p>
                    Budget: ₹{request.budget_inr.toLocaleString("en-IN")} ·
                    Timing: {request.timeframe.replaceAll("_", " ")}
                  </p>
                  {request.notes && (
                    <p className="order-notes">Note: {request.notes}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="admin-section">
          <div className="section-heading">
            <div>
              <p className="admin-eyebrow">ORDERS</p>
              <h2>Order requests</h2>
            </div>
            <button className="secondary-button" onClick={loadData}>
              Refresh
            </button>
          </div>
          {!orders.length ? (
            <p>No order requests yet.</p>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div className="order-card-header">
                    <div>
                      <strong>Order #{order.id}</strong>
                      <span>
                        {new Date(order.created_at).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <select
                      value={order.status}
                      onChange={(event) => {
                        void updateOrderStatus(order.id, event.target.value);
                      }}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p>
                    <strong>{order.customer_name}</strong> ·{" "}
                    {order.customer_phone}
                    {order.customer_email ? ` · ${order.customer_email}` : ""}
                  </p>
                  <div className="order-products">
                    <strong>Products</strong>
                    {order.order_items?.length ? (
                      order.order_items.map((item) => (
                        <div className="order-product" key={item.id}>
                          <span>
                            {item.product_name} x {item.quantity}
                          </span>
                          <span>
                            ₹
                            {(
                              item.unit_price_inr * item.quantity
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p>Product details unavailable for this order.</p>
                    )}
                  </div>
                  <p>{order.delivery_address}</p>
                  {order.notes && (
                    <p className="order-notes">Note: {order.notes}</p>
                  )}
                  <strong>{`₹${order.total_inr.toLocaleString("en-IN")}`}</strong>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="admin-section">
          <div className="section-heading">
            <div>
              <p className="admin-eyebrow">SOCIAL</p>
              <h2>Instagram links</h2>
              <p className="section-help">
                Add Instagram post, carousel, reel, or video URLs. Supported
                links display as embedded Instagram cards in Behind the Loops.
              </p>
            </div>
          </div>
          <form onSubmit={saveInstagramLinks} className="links-form">
            {!instagramLinks.length && (
              <p className="empty-links">
                No Instagram links added yet. Add your first link below.
              </p>
            )}
            {instagramLinks.map((link, index) => (
              <div className="link-row" key={`${index}-${link}`}>
                <input
                  type="url"
                  aria-label={`Instagram link ${index + 1}`}
                  placeholder="https://www.instagram.com/p/..."
                  value={link}
                  onChange={(event) =>
                    setInstagramLinks(
                      instagramLinks.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  aria-label="Remove Instagram link"
                  onClick={() =>
                    setInstagramLinks(
                      instagramLinks.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    )
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="secondary-button"
              onClick={() => setInstagramLinks([...instagramLinks, ""])}
            >
              <Plus size={16} /> Add Instagram link
            </button>
            <button type="submit" disabled={busy}>
              <Save size={16} /> Save Instagram links
            </button>
          </form>
        </section>
      </div>
      <AdminStyles />
    </main>
  );
}

function AdminStyles() {
  return (
    <style jsx global>{`
      .admin-page {
        min-height: 100vh;
        background: var(--cream);
        color: var(--cocoa);
        padding: 48px 24px;
      }
      .admin-shell,
      .admin-login {
        max-width: 980px;
        margin: 0 auto;
      }
      .admin-login {
        max-width: 460px;
        background: var(--white);
        padding: 40px;
        border: 1px solid rgba(75, 58, 50, 0.12);
      }
      .admin-eyebrow {
        color: var(--coral);
        font:
          700 12px var(--font-lato),
          sans-serif;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .admin-page h1,
      .admin-page h2 {
        margin: 6px 0 8px;
      }
      .admin-page h1 {
        font-size: 40px;
      }
      .admin-page h2 {
        font-size: 26px;
      }
      .admin-page p {
        margin: 0 0 16px;
      }
      .section-help {
        max-width: 640px;
        color: rgba(75, 58, 50, 0.7);
        font-size: 14px;
        font-weight: 400;
      }
      .admin-login form,
      .product-form,
      .category-form,
      .links-form {
        display: grid;
        gap: 16px;
        margin-top: 28px;
      }
      .admin-page label {
        display: grid;
        gap: 6px;
        font-weight: 700;
        font-size: 13px;
      }
      .admin-page input,
      .admin-page select,
      .admin-page textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid rgba(75, 58, 50, 0.2);
        background: var(--white);
        color: var(--cocoa);
        border-radius: 4px;
        font:
          400 15px var(--font-lato),
          sans-serif;
      }
      .admin-page button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 16px;
        border: 0;
        background: var(--coral);
        color: var(--white);
        font-weight: 700;
        cursor: pointer;
        border-radius: 4px;
      }
      .admin-page button:disabled {
        opacity: 0.6;
        cursor: wait;
      }
      .secondary-button {
        background: transparent !important;
        color: var(--cocoa) !important;
        border: 1px solid rgba(75, 58, 50, 0.25) !important;
      }
      .admin-header,
      .section-heading,
      .product-row,
      .link-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .admin-header {
        margin-bottom: 36px;
      }
      .admin-header-actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .admin-orders-tab {
        display: inline-flex;
        align-items: center;
        gap: 11px;
        min-width: 220px;
        padding: 10px 12px 10px 10px;
        border: 1px solid rgba(75, 58, 50, 0.18);
        border-radius: 10px;
        background: var(--white);
        color: var(--cocoa);
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(75, 58, 50, 0.05);
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease,
          transform 0.2s ease;
      }
      .admin-orders-tab:hover {
        border-color: var(--coral);
        box-shadow: 0 7px 18px rgba(75, 58, 50, 0.1);
        transform: translateY(-1px);
      }
      .admin-orders-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 9px;
        background: var(--sage-light);
        color: var(--sage);
      }
      .admin-orders-copy {
        display: grid;
        gap: 2px;
        flex: 1;
      }
      .admin-orders-copy strong {
        font-size: 14px;
      }
      .admin-orders-copy small {
        color: rgba(75, 58, 50, 0.62);
        font-size: 11px;
      }
      .admin-orders-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 24px;
        padding: 0 6px;
        border-radius: 999px;
        background: var(--coral);
        color: var(--white);
        font-size: 11px;
        font-weight: 700;
      }
      .admin-orders-arrow {
        color: rgba(75, 58, 50, 0.5);
      }
      .admin-section {
        background: var(--white);
        padding: 32px;
        margin-bottom: 24px;
        border: 1px solid rgba(75, 58, 50, 0.1);
      }
      .category-form {
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: end;
        margin: 24px 0 28px;
        padding: 16px;
        background: var(--sage-light);
        border-left: 3px solid var(--sage);
      }
      .category-form button {
        min-height: 44px;
      }
      .product-form {
        grid-template-columns: repeat(2, 1fr);
      }
      .product-form .wide,
      .product-form button {
        grid-column: 1 / -1;
      }
      .check {
        display: flex !important;
        align-items: center;
        gap: 8px !important;
      }
      .check input {
        width: auto;
      }
      .product-groups {
        display: grid;
        gap: 28px;
        margin-top: 32px;
      }
      .product-group h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-size: 18px;
      }
      .product-group h3 span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 24px;
        padding: 0 6px;
        border-radius: 999px;
        background: var(--sage-light);
        color: var(--cocoa);
        font:
          700 12px var(--font-lato),
          sans-serif;
      }
      .product-group > p {
        margin-top: 12px;
        color: rgba(75, 58, 50, 0.7);
        font-size: 14px;
      }
      .product-list {
        display: grid;
        gap: 8px;
        margin-top: 32px;
      }
      .product-row {
        padding: 14px 0;
        border-top: 1px solid rgba(75, 58, 50, 0.1);
      }
      .product-row span {
        display: block;
        margin-top: 4px;
        color: rgba(75, 58, 50, 0.7);
        font-size: 13px;
      }
      .row-actions {
        display: flex;
        gap: 8px;
      }
      .row-actions button,
      .link-row button {
        padding: 9px;
        background: transparent;
        color: var(--cocoa);
        border: 1px solid rgba(75, 58, 50, 0.2);
      }
      .row-actions button:first-child {
        min-width: 72px;
      }
      .row-action-label {
        font-size: 12px;
      }
      .link-row input {
        flex: 1;
      }
      .links-form > button {
        justify-self: start;
      }
      .admin-message {
        padding: 12px;
        background: var(--sage-light);
        border-left: 3px solid var(--sage);
      }
      .order-list {
        display: grid;
        gap: 12px;
        margin-top: 24px;
      }
      .order-card {
        padding: 18px;
        border: 1px solid rgba(75, 58, 50, 0.12);
        background: var(--cream);
      }
      .order-card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 12px;
      }
      .order-card-header span {
        display: block;
        margin-top: 4px;
        color: rgba(75, 58, 50, 0.65);
        font-size: 12px;
      }
      .order-card-header select {
        width: auto;
        min-width: 150px;
      }
      .order-card p {
        margin: 6px 0;
        font-size: 14px;
      }
      .order-notes {
        color: rgba(75, 58, 50, 0.75);
        font-style: italic;
      }
      .order-products {
        margin: 12px 0;
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.65);
        border: 1px solid rgba(75, 58, 50, 0.1);
      }
      .order-product {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-top: 6px;
        font-size: 14px;
      }
      .image-upload-field {
        display: grid;
        gap: 10px;
      }
      .image-upload-field > label {
        gap: 8px;
      }
      .image-upload-field input[type="file"] {
        padding: 9px;
      }
      .add-image-button {
        display: inline-flex !important;
        position: relative;
        width: fit-content;
        align-items: center;
        padding: 11px 18px;
        border-radius: 6px;
        background: var(--coral);
        color: var(--white);
        cursor: pointer;
        font-weight: 700 !important;
        text-transform: none !important;
        letter-spacing: 0 !important;
      }
      .add-image-button input[type="file"] {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        padding: 0 !important;
        opacity: 0;
        cursor: pointer;
      }
      .field-help {
        margin: 0 !important;
        color: rgba(75, 58, 50, 0.7);
        font-size: 12px !important;
        font-weight: 400;
      }
      .product-preview {
        display: grid;
        gap: 8px;
        width: min(100%, 280px);
      }
      .image-gallery-editor {
        display: grid;
        gap: 10px;
        grid-column: 1 / -1;
        padding: 14px;
        border: 1px solid rgba(75, 58, 50, 0.12);
        border-radius: 10px;
        background: var(--sage-light);
      }
      .image-gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;
      }
      .gallery-image-option {
        position: relative;
        overflow: hidden;
        padding: 0 0 8px;
        border: 1px solid rgba(75, 58, 50, 0.16);
        border-radius: 10px;
        background: var(--white);
        color: var(--cocoa);
        text-align: left;
        cursor: pointer;
        width: 100%;
        height: 100%;
      }
      .gallery-image-wrapper {
        position: relative;
      }
      .gallery-image-actions {
        position: absolute;
        top: 6px;
        right: 6px;
        display: flex;
        gap: 6px;
        z-index: 10;
      }
      .admin-page button.gallery-image-action {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        color: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--white);
        cursor: pointer;
        padding: 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: transform 0.15s ease;
      }
      .admin-page button.gallery-image-action:hover {
        transform: scale(1.1);
      }
      .admin-page button.gallery-image-action.delete {
        background: var(--coral);
      }
      .admin-page button.gallery-image-action.edit {
        background: var(--sage);
      }
      .gallery-image-option.selected {
        border: 2px solid var(--coral);
        box-shadow: 0 0 0 2px rgba(224, 122, 105, 0.18);
      }
      .gallery-image-option img {
        display: block;
        width: 100%;
        height: 130px;
        object-fit: cover;
      }
      .gallery-image-option span {
        display: block;
        padding: 7px 9px 0;
        font-size: 11px;
        font-weight: 700;
      }
      .preview-label {
        margin: 0 !important;
        color: var(--cocoa);
        font-size: 13px !important;
        font-weight: 700 !important;
      }
      .preview-card {
        overflow: hidden;
        border: 1px solid rgba(75, 58, 50, 0.1);
        border-radius: 12px;
        background: var(--cream);
        box-shadow: var(--shadow-sm);
      }
      .preview-image-wrap {
        aspect-ratio: 4 / 5;
        overflow: hidden;
        background: var(--cream);
      }
      .preview-image-wrap img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .preview-info {
        display: grid;
        gap: 6px;
        padding: 12px;
        background: var(--white);
      }
      .preview-info span {
        min-height: 24px;
        color: rgba(75, 58, 50, 0.6);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }
      .preview-info strong {
        font:
          700 16px var(--font-playfair),
          Georgia,
          serif;
      }
      .preview-info b {
        font:
          700 16px var(--font-playfair),
          Georgia,
          serif;
      }
      .prompt-box {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 14px;
        background: var(--sage-light);
        border-left: 3px solid var(--sage);
      }
      .prompt-box strong {
        font-size: 13px;
      }
      .prompt-box p {
        margin: 5px 0 0;
        font-size: 12px;
        font-weight: 400;
        line-height: 1.5;
      }
      .prompt-box .secondary-button {
        flex: 0 0 auto;
        padding: 9px 11px;
      }
      @media (max-width: 640px) {
        .admin-page {
          padding: 24px 16px;
        }
        .admin-section,
        .admin-login {
          padding: 24px;
        }
        .category-form,
        .product-form {
          grid-template-columns: 1fr;
        }
        .product-form .wide,
        .product-form button {
          grid-column: auto;
        }
        .admin-header,
        .section-heading,
        .order-card-header {
          align-items: flex-start;
          flex-direction: column;
        }
        .admin-header-actions {
          width: 100%;
          align-items: stretch;
          flex-direction: column;
        }
        .admin-orders-tab {
          width: 100%;
        }
        .product-row {
          align-items: flex-start;
        }
        .order-card-header select {
          width: 100%;
        }
      }
      .cropper-container {
        display: grid;
        gap: 16px;
        background: var(--white);
        padding: 16px;
        border: 1px solid rgba(75, 58, 50, 0.1);
        border-radius: 8px;
      }
      .cropper-wrap {
        max-height: 60vh;
        overflow: hidden;
      }
      .cropper-img {
        max-width: 100%;
        max-height: 60vh;
        object-fit: contain;
      }
      .cropper-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
    `}</style>
  );
}
