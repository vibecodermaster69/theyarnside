import { getProducts } from "@/lib/catalogue";
import ShopCatalogueClient from "@/components/ShopCatalogueClient";

export const revalidate = 60;

type ShopSearchParams = { category?: string; q?: string };

export default async function ShopPage({ searchParams }: { searchParams: ShopSearchParams }) {
  const products = await getProducts();
  const category = searchParams.category ?? "all";
  const query = searchParams.q ?? "";
  return (
    // Keyed on the filters so a push to /shop?q=... resets the client state that
    // was seeded from these props.
    <ShopCatalogueClient
      key={`${category}|${query}`}
      products={products}
      initialCategory={category}
      initialQuery={query}
    />
  );
}
