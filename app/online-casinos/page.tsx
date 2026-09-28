import type { Metadata } from "next";
import { categoryMetadata, renderCategory } from "../components/CategoryPage";
export const metadata: Metadata = categoryMetadata("online-casinos");
export default function Page(){return renderCategory("online-casinos");}
