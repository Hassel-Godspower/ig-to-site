import { NextRequest } from "next/server";
import { createBookingRequest } from "@/lib/commerceStore";
import {
  requireBookingPro,
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
    await requireBookingPro(jobId);
    const body = await req.json();
    const row = await createBookingRequest({
      jobId,
      customerName: body.name || body.customerName,
      customerPhone: body.phone || body.customerPhone,
      service: body.service,
      preferredDate: body.date || body.preferredDate,
      preferredTime: body.time || body.preferredTime,
      notes: body.notes,
    });
    return json({ ok: true, id: row.id }, 200, req);
  } catch (err) {
    return errJson(err, req);
  }
}
