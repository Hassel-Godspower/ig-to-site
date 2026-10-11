"use client";

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description?: string;
  priceKobo: number;
  imageUrl?: string;
  stock?: number | null;
  active: boolean;
};

type Order = {
  id: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  items?: { name: string; qty: number; priceKobo: number }[];
  total_kobo?: number;
  status?: string;
  created_at?: string;
  notes?: string;
};

type Booking = {
  id: string;
  customer_name?: string;
  customer_phone?: string;
  service?: string;
  preferred_date?: string;
  preferred_time?: string;
  notes?: string;
  status?: string;
  created_at?: string;
};

type Tab = "orders" | "bookings" | "products";

const page: CSSProperties = {
  minHeight: "100dvh",
  background: "#0b0d12",
  color: "#f3f4f6",
  fontFamily: "system-ui, sans-serif",
  padding: "20px 16px 48px",
};
const wrap: CSSProperties = { maxWidth: 900, margin: "0 auto" };
const card: CSSProperties = {
  background: "#12151c",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: 16,
  marginBottom: 12,
};
const tabBar: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 20,
};
const btn = (active: boolean): CSSProperties => ({
  padding: "10px 16px",
  borderRadius: 10,
  border: active ? "none" : "1px solid rgba(167,139,250,0.35)",
  background: active ? "#a78bfa" : "transparent",
  color: active ? "#0b0d12" : "#ede9fe",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 14,
});
const input: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#0b0d12",
  color: "#f3f4f6",
  marginBottom: 10,
  fontSize: 14,
  boxSizing: "border-box",
};
const label: CSSProperties = {
  fontSize: 12,
  color: "#9ca3af",
  marginBottom: 4,
  display: "block",
};

function naira(kobo: number) {
  return `₦${(Number(kobo) / 100).toLocaleString("en-NG")}`;
}

export default function MerchantAdminPage() {
  const params = useParams();
  const search = useSearchParams();
  const jobId = String(params.jobId || "");

  const [access, setAccess] = useState("");
  const [tab, setTab] = useState<Tab>("orders");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fromUrl = search.get("access") || "";
    let token = fromUrl;
    try {
      if (!token) token = sessionStorage.getItem("goke_dash_access") || "";
      if (fromUrl) sessionStorage.setItem("goke_dash_access", fromUrl);
    } catch {
      /* ignore */
    }
    setAccess(token);
  }, [search]);

  const headers = useCallback(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (access) h["x-goke-access"] = access;
    return h;
  }, [access]);

  const loadAll = useCallback(async () => {
    if (!jobId || !access) {
      setError("Open this page from your dashboard (use the access link in your email).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [pRes, oRes, bRes] = await Promise.all([
        fetch(`/api/commerce/${jobId}/products`, { headers: headers() }),
        fetch(`/api/commerce/${jobId}/orders`, { headers: headers() }),
        fetch(`/api/booking/${jobId}/requests`, { headers: headers() }),
      ]);
      const pData = await pRes.json().catch(() => ({}));
      const oData = await oRes.json().catch(() => ({}));
      const bData = await bRes.json().catch(() => ({}));

      if (pRes.ok) setProducts(pData.products || []);
      if (oRes.ok) setOrders(oData.orders || []);
      if (bRes.ok) setBookings(bData.requests || []);

      if (!pRes.ok && pRes.status === 403 && !oRes.ok && !bRes.ok) {
        setError(
          pData.error ||
            "Unlock Gòke Commerce or Booking Pro from My sites first."
        );
      } else if (!pRes.ok && pRes.status === 401) {
        setError("Access expired. Request a new link from the dashboard.");
      } else if (!pRes.ok && pRes.status !== 403) {
        setError(pData.error || "Could not load admin data");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [jobId, access, headers]);

  useEffect(() => {
    if (access) void loadAll();
  }, [access, loadAll]);

  async function addProduct(e: FormEvent) {
    e.preventDefault();
    setInfo("");
    setError("");
    const priceNum = Number(price);
    if (!name.trim() || !(priceNum >= 0)) {
      setError("Name and price (₦) required");
      return;
    }
    const res = await fetch(`/api/commerce/${jobId}/products`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        name: name.trim(),
        description: desc.trim() || undefined,
        price: priceNum,
        imageUrl: imageUrl.trim() || undefined,
        active: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Could not save product");
      return;
    }
    setName("");
    setPrice("");
    setDesc("");
    setImageUrl("");
    setInfo("Product saved");
    void loadAll();
  }

  async function removeProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(
      `/api/commerce/${jobId}/products?id=${encodeURIComponent(id)}`,
      { method: "DELETE", headers: headers() }
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Delete failed");
      return;
    }
    void loadAll();
  }

  return (
    <div style={page}>
      <div style={wrap}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#a78bfa",
                fontWeight: 700,
              }}
            >
              gòke · Business admin
            </p>
            <h1 style={{ margin: "4px 0 0", fontSize: 22 }}>
              Orders, bookings &amp; products
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#9ca3af" }}>
              Site <code style={{ color: "#c4b5fd" }}>{jobId}</code>
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link
              href={
                access
                  ? `/dashboard?access=${encodeURIComponent(access)}`
                  : "/dashboard"
              }
              style={{ ...btn(false), textDecoration: "none" }}
            >
              ← My sites
            </Link>
            <button type="button" style={btn(false)} onClick={() => void loadAll()}>
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <p
            style={{
              background: "#450a0a",
              color: "#fca5a5",
              padding: "12px 14px",
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            {error}
          </p>
        )}
        {info && (
          <p
            style={{
              background: "rgba(167,139,250,0.15)",
              color: "#ede9fe",
              padding: "12px 14px",
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            {info}
          </p>
        )}

        <div style={tabBar}>
          <button type="button" style={btn(tab === "orders")} onClick={() => setTab("orders")}>
            Orders ({orders.length})
          </button>
          <button
            type="button"
            style={btn(tab === "bookings")}
            onClick={() => setTab("bookings")}
          >
            Bookings ({bookings.length})
          </button>
          <button
            type="button"
            style={btn(tab === "products")}
            onClick={() => setTab("products")}
          >
            Products ({products.length})
          </button>
        </div>

        {loading && <p style={{ color: "#9ca3af" }}>Loading…</p>}

        {tab === "orders" && (
          <div>
            {!orders.length && !loading && (
              <p style={{ color: "#9ca3af" }}>
                No orders yet. When customers check out (Commerce Pro), they appear
                here.
              </p>
            )}
            {orders.map((o) => (
              <div key={o.id} style={card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <strong>{o.customer_name || "Customer"}</strong>
                  <span style={{ color: "#a78bfa" }}>
                    {naira(o.total_kobo || 0)}
                  </span>
                </div>
                <p style={{ margin: "6px 0", fontSize: 13, color: "#9ca3af" }}>
                  {o.customer_phone || ""} {o.customer_email || ""}
                </p>
                <ul style={{ margin: "8px 0", paddingLeft: 18, fontSize: 14 }}>
                  {(o.items || []).map((it, i) => (
                    <li key={i}>
                      {it.qty}× {it.name} — {naira(it.priceKobo * it.qty)}
                    </li>
                  ))}
                </ul>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                  {o.status || "pending"}
                  {o.created_at
                    ? ` · ${new Date(o.created_at).toLocaleString()}`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "bookings" && (
          <div>
            {!bookings.length && !loading && (
              <p style={{ color: "#9ca3af" }}>
                No booking requests yet. Booking Pro stores form submissions here.
              </p>
            )}
            {bookings.map((b) => (
              <div key={b.id} style={card}>
                <strong>{b.customer_name || "Guest"}</strong>
                <p style={{ margin: "6px 0", fontSize: 14 }}>
                  {b.service || "Service"}
                  {b.preferred_date ? ` · ${b.preferred_date}` : ""}
                  {b.preferred_time ? ` ${b.preferred_time}` : ""}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>
                  {b.customer_phone || ""} {b.notes || ""}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "products" && (
          <div>
            <form onSubmit={addProduct} style={{ ...card, marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Add product</h2>
              <label style={label}>Name</label>
              <input
                style={input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                required
              />
              <label style={label}>Price (₦)</label>
              <input
                style={input}
                type="number"
                min={0}
                step={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                required
              />
              <label style={label}>Description</label>
              <input
                style={input}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Optional"
              />
              <label style={label}>Image URL</label>
              <input
                style={input}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
              />
              <button type="submit" style={btn(true)}>
                Save product
              </button>
            </form>

            {products.map((p) => (
              <div key={p.id} style={card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{p.name}</strong>
                    <p style={{ margin: "4px 0 0", color: "#a78bfa" }}>
                      {naira(p.priceKobo)}
                    </p>
                    {p.description && (
                      <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9ca3af" }}>
                        {p.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    style={btn(false)}
                    onClick={() => void removeProduct(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
