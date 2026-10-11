import { NextRequest } from "next/server";
import { listProducts } from "@/lib/commerceStore";
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const job = await requireCommercePro(jobId);
    const products = await listProducts(jobId, true);
    return json(
      {
        jobId,
        siteUrl: job.siteUrl,
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.priceKobo / 100,
          priceKobo: p.priceKobo,
          imageUrl: p.imageUrl,
          stock: p.stock,
        })),
      },
      200,
      req
    );
  } catch (err) {
    return errJson(err, req);
  }
}
