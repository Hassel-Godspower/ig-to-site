import { NextRequest } from "next/server";
import { listBookingRequests } from "@/lib/commerceStore";
import {
  requireBookingPro,
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
    const job = await requireBookingPro(jobId);
    requireOwnerAccess(req, job);
    const requests = await listBookingRequests(jobId);
    return json({ requests }, 200, req);
  } catch (err) {
    return errJson(err, req);
  }
}
