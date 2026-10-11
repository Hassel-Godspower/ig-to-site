import { getSupabase } from "./supabase";

export interface CommerceProduct {
  id: string;
  jobId: string;
  name: string;
  description?: string;
  priceKobo: number;
  imageUrl?: string;
  sku?: string;
  stock?: number | null;
  active: boolean;
}

export interface CommerceOrder {
  id: string;
  jobId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: { id?: string; name: string; priceKobo: number; qty: number }[];
  totalKobo: number;
  status: string;
  paystackRef?: string;
}

function mapProduct(row: any): CommerceProduct {
  return {
    id: row.id,
    jobId: row.job_id,
    name: row.name,
    description: row.description ?? undefined,
    priceKobo: Number(row.price_kobo || 0),
    imageUrl: row.image_url ?? undefined,
    sku: row.sku ?? undefined,
    stock: row.stock,
    active: row.active !== false,
  };
}

export async function listProducts(
  jobId: string,
  activeOnly = false
): Promise<CommerceProduct[]> {
  let q = getSupabase()
    .from("commerce_products")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });
  if (activeOnly) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProduct);
}

export async function upsertProduct(
  jobId: string,
  input: {
    id?: string;
    name: string;
    description?: string;
    priceKobo: number;
    imageUrl?: string;
    sku?: string;
    stock?: number | null;
    active?: boolean;
  }
): Promise<CommerceProduct> {
  const row = {
    job_id: jobId,
    name: input.name,
    description: input.description ?? null,
    price_kobo: Math.max(0, Math.round(input.priceKobo)),
    image_url: input.imageUrl ?? null,
    sku: input.sku ?? null,
    stock: input.stock ?? null,
    active: input.active !== false,
    updated_at: new Date().toISOString(),
  };
  if (input.id) {
    const { data, error } = await getSupabase()
      .from("commerce_products")
      .update(row)
      .eq("id", input.id)
      .eq("job_id", jobId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapProduct(data);
  }
  const { data, error } = await getSupabase()
    .from("commerce_products")
    .insert(row)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapProduct(data);
}

export async function deleteProduct(jobId: string, productId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("commerce_products")
    .delete()
    .eq("id", productId)
    .eq("job_id", jobId);
  if (error) throw new Error(error.message);
}

export async function createOrder(input: {
  jobId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: { id?: string; name: string; priceKobo: number; qty: number }[];
  notes?: string;
}): Promise<CommerceOrder> {
  const items = input.items
    .filter((i) => i.name && i.qty > 0)
    .map((i) => ({
      id: i.id,
      name: String(i.name).slice(0, 200),
      priceKobo: Math.max(0, Math.round(i.priceKobo)),
      qty: Math.min(99, Math.max(1, Math.round(i.qty))),
    }));
  if (!items.length) throw new Error("No valid items");
  const total = items.reduce((s, i) => s + i.priceKobo * i.qty, 0);
  const { data, error } = await getSupabase()
    .from("commerce_orders")
    .insert({
      job_id: input.jobId,
      customer_name: input.customerName?.slice(0, 120) ?? null,
      customer_phone: input.customerPhone?.slice(0, 40) ?? null,
      customer_email: input.customerEmail?.slice(0, 120) ?? null,
      items,
      total_kobo: total,
      status: "pending",
      notes: input.notes?.slice(0, 500) ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    jobId: data.job_id,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    customerEmail: data.customer_email,
    items: data.items,
    totalKobo: Number(data.total_kobo),
    status: data.status,
    paystackRef: data.paystack_ref,
  };
}

export async function listOrders(jobId: string) {
  const { data, error } = await getSupabase()
    .from("commerce_orders")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createBookingRequest(input: {
  jobId: string;
  customerName?: string;
  customerPhone?: string;
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}): Promise<{ id: string }> {
  const { data, error } = await getSupabase()
    .from("booking_requests")
    .insert({
      job_id: input.jobId,
      customer_name: input.customerName?.slice(0, 120) ?? null,
      customer_phone: input.customerPhone?.slice(0, 40) ?? null,
      service: input.service?.slice(0, 200) ?? null,
      preferred_date: input.preferredDate?.slice(0, 40) ?? null,
      preferred_time: input.preferredTime?.slice(0, 40) ?? null,
      notes: input.notes?.slice(0, 500) ?? null,
      status: "new",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id };
}

export async function listBookingRequests(jobId: string) {
  const { data, error } = await getSupabase()
    .from("booking_requests")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return data ?? [];
}
