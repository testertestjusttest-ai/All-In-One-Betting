import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryConfig, categoryMetadata, renderCategory, type CategoryKey } from "../components/CategoryPage";

const categories = Object.keys(categoryConfig) as CategoryKey[];

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  if (!categories.includes(category as CategoryKey)) {
    return {};
  }

  return categoryMetadata(category as CategoryKey);
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!categories.includes(category as CategoryKey)) {
    notFound();
  }

  return renderCategory(category as CategoryKey);
}
