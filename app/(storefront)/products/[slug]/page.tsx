import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/catalogue";
import ProductPageClient from "@/components/ProductPageClient";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

async function findProduct(slug: string) {
  const products = await getProducts();
  return products.find((item) => item.slug === decodeURIComponent(slug)) ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await findProduct(params.slug);
  if (!product) return { title: "Piece not found | THE YARN SIDE" };
  return {
    title: `${product.name} | THE YARN SIDE`,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [{ url: product.image }] },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const products = await getProducts();
  const product = products.find((item) => item.slug === decodeURIComponent(params.slug));
  if (!product) notFound();
  const recommended = products.filter((item) => item.slug !== product.slug).slice(0, 3);
  return <ProductPageClient product={product} recommended={recommended} />;
}
