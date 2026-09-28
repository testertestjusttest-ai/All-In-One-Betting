import type { Metadata } from "next";
import { categoryMetadata, renderCategory } from "../components/CategoryPage";
export const metadata: Metadata = categoryMetadata("betting-sites");
export default function Page(){return renderCategory("betting-sites");}
