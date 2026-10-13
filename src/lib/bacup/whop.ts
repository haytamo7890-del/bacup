import { createHmac, timingSafeEqual } from "node:crypto";
import { BACUP } from "@/config/bacup";

/**
 * Whop (card payments). Env (server only):
 *   WHOP_ENV            "sandbox" | "production"   (default sandbox)
 *   WHOP_API_KEY        company API key
 *   WHOP_COMPANY_ID     biz_…
 *   WHOP_WEBHOOK_SECRET ws_…  (Standard Webhooks signing secret)
 */
const SANDBOX = (process.env.WHOP_ENV ?? "sandbox") !== "production";
const API = SANDBOX ? "https://sandbox-api.whop.com/api/v1" : "https://api.whop.com/api/v1";
const WEB = SANDBOX ? "https://sandbox.whop.com" : "https://whop.com";

export function whopConfigured(): boolean {
  return !!(process.env.WHOP_API_KEY && process.env.WHOP_COMPANY_ID);
}

async function whop<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.WHOP_API_KEY ?? ""}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`whop ${path} ${res.status}`);
  return (await res.json()) as T;
}

/** Hosted Whop checkout for one order. Amount always computed by our server. */
export async function createWhopCheckout(input: {
  orderId: string;
  orderRef: string;
  amount: number;
  redirectUrl: string;
}): Promise<{ id: string; url: string }> {
  const cfg = await whop<{ id: string; purchase_url: string }>("/checkout_configurations", {
    method: "POST",
    body: JSON.stringify({
      mode: "payment",
      plan: {
        company_id: process.env.WHOP_COMPANY_ID,
        currency: "mad",
        initial_price: input.amount,
        plan_type: "one_time",
        visibility: "hidden",
        title: `Accès complet · ${BACUP.accessLabel}`,
        product: { external_identifier: "bacup-acces-complet", title: "Bac Up · Accès complet" },
      },
      metadata: { order_id: input.orderId, order_ref: input.orderRef },
      redirect_url: input.redirectUrl,
    }),
  });
  const url = cfg.purchase_url.startsWith("http") ? cfg.purchase_url : `${WEB}${cfg.purchase_url}`;
  return { id: cfg.id, url };
}

export type WhopPayment = {
  id: string;
  status: string | null;
  substatus?: string | null;
  total: number | null;
  currency: string | null;
  metadata: Record<string, unknown> | null;
  refunded_amount?: number | null;
  paid_at?: string | null;
};

export function getWhopPayment(id: string): Promise<WhopPayment> {
  return whop<WhopPayment>(`/payments/${encodeURIComponent(id)}`);
}

/** Standard Webhooks check: HMAC-SHA256 over "id.timestamp.body", base64, 5 min tolerance. */
export function verifyWhopSignature(raw: string, headers: Headers): boolean {
  const secret = process.env.WHOP_WEBHOOK_SECRET;
  const id = headers.get("webhook-id");
  const ts = headers.get("webhook-timestamp");
  const sigHeader = headers.get("webhook-signature");
  if (!secret || !id || !ts || !sigHeader) return false;
  const age = Math.abs(Date.now() / 1000 - Number(ts));
  if (!Number.isFinite(age) || age > 300) return false;

  const expected = createHmac("sha256", secret).update(`${id}.${ts}.${raw}`).digest();
  return sigHeader.split(" ").some((part) => {
    const [, sig] = part.split(",");
    if (!sig) return false;
    const got = Buffer.from(sig, "base64");
    return got.length === expected.length && timingSafeEqual(got, expected);
  });
}
