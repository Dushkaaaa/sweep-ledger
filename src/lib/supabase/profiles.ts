import type { User } from "@supabase/supabase-js";
import { supabase } from "./client";

export type OwnerProfile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  created_at: string;
};

export async function ensureProfile(user: User) {
  const fullName =
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : null;
  const companyName =
    typeof user.user_metadata.company_name === "string"
      ? user.user_metadata.company_name
      : null;
  const phone =
    typeof user.user_metadata.phone === "string"
      ? user.user_metadata.phone
      : null;

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: fullName,
      company_name: companyName,
      phone,
    },
    {
      onConflict: "id",
    },
  );

  if (error) {
    throw error;
  }
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as OwnerProfile | null;
}
