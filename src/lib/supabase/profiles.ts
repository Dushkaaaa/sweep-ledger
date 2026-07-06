import type { User } from "@supabase/supabase-js";
import type { LanguageCode } from "@/app/_i18n/translations";
import { supabase } from "./client";

export type OwnerProfile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  preferred_language: LanguageCode | null;
  logo_data_url: string | null;
  created_at: string;
};

function isLanguageCode(value: unknown): value is LanguageCode {
  return value === "uk" || value === "en" || value === "de" || value === "pl";
}

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
  const preferredLanguage = isLanguageCode(user.user_metadata.preferred_language)
    ? user.user_metadata.preferred_language
    : null;
  const profile: {
    id: string;
    full_name: string | null;
    company_name: string | null;
    phone: string | null;
    preferred_language?: LanguageCode;
  } = {
    id: user.id,
    full_name: fullName,
    company_name: companyName,
    phone,
  };

  if (preferredLanguage) {
    profile.preferred_language = preferredLanguage;
  }

  const { error } = await supabase.from("profiles").upsert(
    profile,
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

export async function updateProfileLogo(logoDataUrl: string | null) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ logo_data_url: logoDataUrl })
    .eq("id", user.id);

  if (error) {
    throw error;
  }
}

export async function updateOwnerPassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }
}

export async function updateProfileLanguage(language: LanguageCode) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ preferred_language: language })
    .eq("id", user.id);

  if (error) {
    throw error;
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      preferred_language: language,
    },
  });

  if (metadataError) {
    throw metadataError;
  }
}
