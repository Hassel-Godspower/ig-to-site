import { NextRequest } from "next/server";
import { createOrder } from "@/lib/commerceStore";
import {
  requireCommercePro,
  json,
  errJson,
  corsHeaders,
} from "@/lib/commerceAuth";

export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const job = await requireCommercePro(jobId);
    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return json({ error: "items required" }, 400, req);
    if (items.length > 50) return json({ error: "Too many items" }, 400, req);

    const order = await createOrder({
      jobId,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      items: items.map((i: any) => ({
        id: i.id,
        name: String(i.name || "Item"),
        priceKobo: Number(
          i.priceKobo ?? Math.round(Number(i.price || 0) * 100)
        ),
        qty: Math.max(1, Number(i.qty || 1)),
      })),
      notes: body.notes,
    });

    const phone = job.phone || "";
    const digits = String(phone).replace(/\D/g, "");
    const text = encodeURIComponent(
      `Order ${order.id.slice(0, 8)} — total ₦${(order.totalKobo / 100).toLocaleString("en-NG")}`
    );
    const waUrl = digits ? `https://wa.me/${digits}?text=${text}` : null;

    return json({ order, waUrl }, 200, req);
  } catch (err) {
    return errJson(err, req);
  }
}
