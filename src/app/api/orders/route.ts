import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { createAdminSupabase } from "@/lib/supabase-admin";
import { createWhopCheckout, whopConfigured } from "@/lib/bacup/whop";
import { BACUP } from "@/config/bacup";
import { FEATURES } from "@/config";

type Body = {
  method?: unknown;
  promoCode?: unknown;
  via?: unknown;
  phone?: unknown;
  city?: unknown;
  address?: unknown;
  entry?: unknown;
};

const clean = (v: unknown, max: number): string =>
  typeof v === "string" ? v.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max) : "";

/**
 * Creates an order. The total is always recomputed here:
 *   price − code discount (valid active code only) + COD delivery fee.
 * card -> returns the Whop checkout URL. cod -> returns the order ref.
 */
export async function POST(req: Request) {
  let b: Body;
  try {
    b = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const method = b.method === "cod" ? "cod" : b.method === "card" ? "card" : null;
  if (!method) return NextResponse.json({ error: "bad_method" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data: sp } = await supabase
    .from("student_profiles")
    .select("status, levels(code)")
    .eq("id", user.id)
    .maybeSingle();
  const level = (sp?.levels as unknown as { code: string } | null)?.code ?? null;
  if (level === "1bac" && !FEATURES.level1bac) return NextResponse.json({ error: "level_locked" }, { status: 403 });
  if (sp?.status === "active") return NextResponse.json({ error: "already_active" }, { status: 409 });

  // Code: only an active code counts. Invalid codes are dropped, never trusted.
  let promoCode: string | null = null;
  let discount = 0;
  const rawCode = clean(b.promoCode, 20);
  if (rawCode) {
    const { data: promo } = await supabase.rpc("validate_promo", { p_code: rawCode });
    const row = Array.isArray(promo) ? (promo[0] as { code: string; discount: number } | undefined) : undefined;
    if (row) {
      promoCode = row.code;
      discount = Math.min(row.discount, BACUP.price);
    }
  }

  let phone = "", city = "", address = "";
  if (method === "cod") {
    phone = clean(b.phone, 20);
    city = clean(b.city, 60);
    address = clean(b.address, 240);
    if (phone.replace(/\D/g, "").length < 9 || !city || address.length < 4) {
      return NextResponse.json({ error: "bad_delivery" }, { status: 400 });
    }
  } else if (!whopConfigured()) {
    return NextResponse.json({ error: "card_unavailable" }, { status: 503 });
  }

  const admin = createAdminSupabase();
  const { data: order, error } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      method,
      price: BACUP.price,
      discount,
      delivery_fee: method === "cod" ? BACUP.codDeliveryFee : 0,
      promo_code: promoCode,
      ref_via: promoCode ? (b.via === "link" ? "link" : "code") : null,
      status: method === "cod" ? "cod_to_confirm" : "pending_payment",
      phone: phone || null,
      city: city || null,
      address: address || null,
    })
    .select("id, ref, total")
    .single();
  if (error || !order) return NextResponse.json({ error: "order_failed" }, { status: 500 });

  if (method === "cod") {
    // Free account opens while the card is on its way.
    await admin.rpc("start_demo", { p_user: user.id });
    if (promoCode) {
      const { data: pc } = await admin.from("promo_codes").select("ambassador_id").eq("code", promoCode).maybeSingle();
      const amb = (pc?.ambassador_id as string | null) ?? null;
      if (amb) {
        await admin.from("referral_sales").insert({
          ambassador_id: amb,
          order_id: order.id,
          via: b.via === "link" ? "link" : "code",
          status: amb === user.id ? "excluded_fraud" : "in_delivery",
        });
      }
    }
    return NextResponse.json({ orderRef: order.ref, total: order.total, method });
  }

  const origin = new URL(req.url).origin;
  const entry = b.entry === "buy" ? "buy" : "start";
  try {
    const co = await createWhopCheckout({
      orderId: order.id as string,
      orderRef: order.ref as string,
      amount: order.total as number,
      redirectUrl: `${origin}/onboarding?entry=${entry}&order=${encodeURIComponent(order.ref as string)}`,
    });
    await admin.from("orders").update({ provider: "whop", provider_session: co.id }).eq("id", order.id);
    return NextResponse.json({ orderRef: order.ref, total: order.total, method, paymentUrl: co.url });
  } catch {
    await admin.from("orders").update({ status: "cancelled", admin_note: "whop checkout failed" }).eq("id", order.id);
    return NextResponse.json({ error: "card_unavailable" }, { status: 502 });
  }
}
