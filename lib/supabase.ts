import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Casino = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  affiliate_url: string | null;
  operator_type: "sportsbook" | "casino" | "both";
  short_description: string;
  bonus_text: string;
  cashback_text: string;
  payment_methods: string[];
  countries: string[];
  license_text: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  verified_at: string | null;
  sort_order: number;
};
