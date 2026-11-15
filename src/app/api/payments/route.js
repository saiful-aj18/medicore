import { NextResponse } from "next/server";

// Payment entry point.
// DEMO MODE (no gateway credentials set): returns a simulated successful
// payment with a transaction ID, so the booking flow works end to end.
// LIVE MODE: set SSLCOMMERZ_STORE_ID, SSLCOMMERZ_STORE_PASSWORD and
// SSLCOMMERZ_IS_SANDBOX=true/false in .env.local, then replace the demo
// branch below with a real SSLCommerz init call (same pattern as Orderly's
// src/lib/sslcommerz.js): create the session server-side, redirect the
// patient to the gateway URL, and verify the callback with val_id
// before marking the booking Paid. Never trust a client-sent "paid" flag.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { amount, method, bookingId } = body;
  if (!amount || !method) {
    return NextResponse.json({ error: "amount and method are required." }, { status: 400 });
  }

  const live = Boolean(process.env.SSLCOMMERZ_STORE_ID && process.env.SSLCOMMERZ_STORE_PASSWORD);
  if (!live) {
    return NextResponse.json({
      mode: "demo",
      paymentId: `MC-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      bookingId: bookingId || null,
      amount,
      method,
      status: "success",
      note: "Demo payment — no real money moved. Set SSLCommerz credentials in .env.local for live payments.",
    });
  }

  // Live gateway hookup goes here — see the comment at the top.
  return NextResponse.json({
    mode: "live",
    status: "pending",
    note: "Live SSLCommerz credentials are set — finish the gateway init call in this route before going live.",
  });
}
