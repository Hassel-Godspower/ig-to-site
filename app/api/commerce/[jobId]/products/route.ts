import { NextRequest } from "next/server";
import {
  listProducts,
  upsertProduct,
  deleteProduct,
} from "@/lib/commerceStore";
import {
  requireCommercePro,
  requireOwnerAccess,
  json,
  errJson,
} from "@/lib/commerceAuth";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const job = await requireCommercePro(jobId);
    requireOwnerAccess(req, job);
    const products = await listProducts(jobId, false);
    return json({ products }, 200, req);
  } catch (err) {
    return errJson(err, req);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const job = await requireCommercePro(jobId);
    requireOwnerAccess(req, job);
    const body = await req.json();
    const product = await upsertProduct(jobId, {
      id: body.id,
      name: String(body.name || "Product").slice(0, 200),
      description: body.description,
      priceKobo: Number(
        body.priceKobo ?? Math.round(Number(body.price || 0) * 100)
      ),
      imageUrl: body.imageUrl,
      sku: body.sku,
      stock: body.stock,
      active: body.active,
    });
    return json({ product }, 200, req);
  } catch (err) {
    return errJson(err, req);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const job = await requireCommercePro(jobId);
    requireOwnerAccess(req, job);
    const id =
      req.nextUrl.searchParams.get("id") ||
      String((await req.json().catch(() => ({}))).id || "");
    if (!id) return json({ error: "id required" }, 400, req);
    await deleteProduct(jobId, id);
    return json({ deleted: true }, 200, req);
  } catch (err) {
    return errJson(err, req);
  }
}
