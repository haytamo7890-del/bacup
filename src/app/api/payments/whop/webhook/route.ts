import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-admin";
import { getWhopPayment, verifyWhopSignature } from "@/lib/bacup/whop";

type Envelope = { type?: string; data?: { id?: string; payment_id?: string; payment?: { id?: string } } };

/**
 * Whop webhook (payment.succeeded, refund.created / refund.updated).
 * The signature is checked, then the payment is re-read from the Whop API:
 * access is granted from Whop's own record, never from the webhook body alone.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWhopSignature(raw, req.headers)) return NextResponse.json({ error: "bad_signature" }, { status: 401 });

  let evt: Envelope;
  try {
    evt = JSON.parse(raw) as Envelope;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const admin = createAdminSupabase();

  if (evt.type === "payment.succeeded" && evt.data?.id) {
    const p = await getWhopPayment(evt.data.id);
    const orderId = typeof p.metadata?.order_id === "string" ? p.metadata.order_id : null;
    if (!orderId || p.status !== "paid") return NextResponse.json({ ok: true, skipped: "not_ours_or_not_paid" });
    const { data, error } = await admin.rpc("mark_order_paid", {
      p_order: orderId,
      p_provider: "whop",
      p_provider_ref: p.id,
      p_amount: p.total ?? 0,
      p_currency: p.currency ?? "",
    });
    if (error) return NextResponse.json({ error: "db" }, { status: 500 }); // Whop retries
    return NextResponse.json({ ok: true, result: data });
  }

  if (evt.type === "refund.created" || evt.type === "refund.updated") {
    const paymentId = evt.data?.payment?.id ?? evt.data?.payment_id ?? null;
    if (!paymentId) return NextResponse.json({ ok: true, skipped: "no_payment_id" });
    const p = await getWhopPayment(paymentId);
    if (!p.refunded_amount || p.refunded_amount <= 0) return NextResponse.json({ ok: true, skipped: "not_refunded" });
    const { data, error } = await admin.rpc("mark_order_refunded", { p_provider: "whop", p_provider_ref: p.id });
    if (error) return NextResponse.json({ error: "db" }, { status: 500 });
    return NextResponse.json({ ok: true, result: data });
  }

  return NextResponse.json({ ok: true, ignored: evt.type ?? "unknown" });
}
