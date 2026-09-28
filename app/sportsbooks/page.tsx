import type { Metadata } from "next";
import { categoryMetadata, renderCategory } from "../components/CategoryPage";
export const metadata: Metadata = categoryMetadata("sportsbooks");
export default function Page(){return renderCategory("sportsbooks");}
