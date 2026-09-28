import type { Metadata } from "next";
import { categoryMetadata, renderCategory } from "../components/CategoryPage";
export const metadata: Metadata = categoryMetadata("casino-bonuses");
export default function Page(){return renderCategory("casino-bonuses");}
