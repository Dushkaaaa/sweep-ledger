import { supabase } from "./client";
import type {
  FinanceEntry,
  NewFinanceEntryInput,
} from "@/app/_data/finance"; // перевірте реальний шлях аліасу @/app у вашому проєкті

type FinanceEntryRow = {
  id: string;
  entry_date: string;
  entry_type: "income" | "expense";
  category: string | null;
  amount: number;
  description: string | null;
};

function normalizeFinanceEntry(row: FinanceEntryRow): FinanceEntry {
  return {
    id: row.id,
    entryDate: row.entry_date,
    entryType: row.entry_type,
    category: (row.category as FinanceEntry["category"]) ?? null,
    amount: Number(row.amount),
    description: row.description,
  };
}

export async function fetchFinanceEntriesForOwner(
  ownerId: string,
): Promise<FinanceEntry[]> {
  const { data, error } = await supabase
    .from("finance_entries")
    .select("*")
    .eq("owner_id", ownerId)
    .order("entry_date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(normalizeFinanceEntry);
}

export async function createFinanceEntryForOwner(
  ownerId: string,
  entry: NewFinanceEntryInput,
): Promise<FinanceEntry> {
  const { data, error } = await supabase
    .from("finance_entries")
    .insert({
      owner_id: ownerId,
      entry_date: entry.entryDate,
      entry_type: entry.entryType,
      category: entry.category,
      amount: entry.amount,
      description: entry.description || null,
    })
    .select()
    .single();

  if (error) throw error;
  return normalizeFinanceEntry(data);
}

export async function deleteFinanceEntryById(entryId: string): Promise<void> {
  const { error } = await supabase
    .from("finance_entries")
    .delete()
    .eq("id", entryId);

  if (error) throw error;
}