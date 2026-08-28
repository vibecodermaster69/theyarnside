import { cache } from "react";

export type CatalogueProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  priceInr: number;
  image: string;
  imageUrls: string[];
  description: string;
  isNew: boolean;
  isBestSeller: boolean;
  stockQuantity: number;
  colorVariants: ColorVariant[];
};

export type ColorVariant = {
  name: string;
  hex: string;
  stockQuantity: number;
  imageUrl?: string;
};

const fallbackImageRoot = "/assets/02_website_assets/product_images/";
const fallbackDescription =
  "Thoughtfully handmade with soft yarn and careful attention to every stitch. A one-of-a-kind piece made to bring warmth and character to your everyday life.";

const fallbackRows = [
  ["Daisy Market Tote", "daisy-market-tote", "Handmade · Crochet Bag", 5200, "daisy_market_tote.png"],
  ["Blush Bunny", "blush-bunny", "Handmade · Amigurumi", 2850, "blush_bunny.png"],
  ["Vintage Square Blanket", "vintage-square-blanket", "Handmade · Crochet Blanket", 8200, "vintage_square_blanket.png"],
  ["The Cozy Beanie", "the-cozy-beanie", "Handmade · Wearable", 3200, "the_cozy_beanie.png"],
  ["Paranda", "paranda", "Hair & Fashion Accessories", 250, "paranda.png"],
  ["Evil Eye", "evil-eye", "Keychains & Charms", 250, "evil_eye.png"],
  ["3 Musketeers Mushroom", "3-musketeers-mushroom", "Keychains & Charms", 250, "three_musketeers_mushroom.png"],
  ["Red Cherry", "red-cherry", "Keychains & Charms", 250, "red_cherry.png"],
] as const;

export const fallbackProducts: CatalogueProduct[] = fallbackRows.map(
  ([name, slug, category, priceInr, image], index) => ({
    id: index + 1,
    name,
    slug,
    category,
    priceInr,
    image: `${fallbackImageRoot}${image}`,
    imageUrls: [`${fallbackImageRoot}${image}`],
    description: fallbackDescription,
    isNew: index < 4,
    isBestSeller: false,
    stockQuantity: index < 4 ? 0 : 5,
    colorVariants: [],
  }),
);

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  category: string;
  price_inr: number;
  image_url: string | null;
  image_urls: unknown;
  description: string | null;
  is_new: boolean;
  is_best_seller: boolean;
  stock_quantity: number;
  color_variants: unknown;
};

function mapProduct(row: ProductRow): CatalogueProduct {
  const imageUrls = Array.isArray(row.image_urls)
    ? row.image_urls.filter((url): url is string => typeof url === "string" && Boolean(url))
    : [];
  const image = row.image_url || imageUrls[0] || fallbackProducts[0].image;
  const colorVariants = Array.isArray(row.color_variants)
    ? row.color_variants.filter((variant): variant is Record<string, unknown> => Boolean(variant) && typeof variant === "object" && typeof (variant as Record<string, unknown>).name === "string" && typeof (variant as Record<string, unknown>).hex === "string")
      .map((variant) => ({ name: String(variant.name), hex: String(variant.hex), stockQuantity: Number(variant.stockQuantity ?? variant.stock_quantity ?? 0), imageUrl: typeof variant.imageUrl === "string" ? variant.imageUrl : undefined }))
      .filter((variant) => Number.isFinite(variant.stockQuantity) && variant.stockQuantity >= 0)
    : [];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    priceInr: row.price_inr,
    image,
    imageUrls: imageUrls.length ? imageUrls : [image],
    description: row.description || fallbackDescription,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    stockQuantity: row.stock_quantity,
    colorVariants,
  };
}

export const getProducts = cache(async (): Promise<CatalogueProduct[]> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fallbackProducts;

  try {
    const response = await fetch(
      `${url}/rest/v1/products?select=id,name,slug,category,price_inr,image_url,image_urls,description,is_new,is_best_seller,stock_quantity,color_variants&is_active=eq.true&order=created_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60, tags: ["products"] } },
    );
    if (!response.ok) return fallbackProducts;
    const rows = (await response.json()) as ProductRow[];
    return rows.length ? rows.map(mapProduct) : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
});

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === decodeURIComponent(slug)) ?? null;
}
