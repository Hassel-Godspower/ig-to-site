import { NextRequest } from "next/server";
import { listOrders } from "@/lib/commerceStore";
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
    const orders = await listOrders(jobId);
    return json({ orders }, 200, req);
  } catch (err) {
    return errJson(err, req);
  }
}
