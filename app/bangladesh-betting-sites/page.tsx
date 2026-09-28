import type { Metadata } from "next";
import { categoryMetadata, renderCategory } from "../components/CategoryPage";
export const metadata: Metadata = categoryMetadata("bangladesh-betting-sites");
export default function Page(){return renderCategory("bangladesh-betting-sites");}
