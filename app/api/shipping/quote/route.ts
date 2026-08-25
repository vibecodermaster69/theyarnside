import { NextRequest, NextResponse } from "next/server";

const shiprocketBaseUrl = "https://apiv2.shiprocket.in/v1/external";

export async function POST(request: NextRequest) {
  const email = process.env.SHIPROCKET_API_EMAIL;
  const password = process.env.SHIPROCKET_API_PASSWORD;
  const pickupPostcode = process.env.SHIPROCKET_PICKUP_POSTCODE?.trim();
  const defaultWeight = Number(process.env.SHIPROCKET_DEFAULT_WEIGHT_KG || "0.5");

  if (!email || !password) {
    return NextResponse.json({ error: "Shiprocket API credentials are not configured on the server." }, { status: 503 });
  }
  if (!pickupPostcode || !/^\d{6}$/.test(pickupPostcode)) {
    return NextResponse.json({ error: "Add your actual 6-digit Shiprocket pickup PIN code to SHIPROCKET_PICKUP_POSTCODE." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { deliveryPostcode?: string; itemCount?: number; cartValue?: number; cod?: boolean } | null;
  const deliveryPostcode = body?.deliveryPostcode?.trim() || "";
  if (!/^\d{6}$/.test(deliveryPostcode)) return NextResponse.json({ error: "Enter a valid 6-digit delivery PIN code." }, { status: 400 });

  const itemCount = Math.max(1, Number(body?.itemCount || 1));
  const cartValue = Math.max(0, Number(body?.cartValue || 0));
  const weight = Math.max(defaultWeight * itemCount, 0.5);

  try {
    const authResponse = await fetch(`${shiprocketBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    const authData = await authResponse.json();
    if (!authResponse.ok || !authData.token) return NextResponse.json({ error: "Shiprocket authentication failed." }, { status: 502 });

    const quoteUrl = new URL(`${shiprocketBaseUrl}/courier/serviceability/`);
    quoteUrl.searchParams.set("pickup_postcode", pickupPostcode);
    quoteUrl.searchParams.set("delivery_postcode", deliveryPostcode);
    quoteUrl.searchParams.set("weight", String(weight));
    quoteUrl.searchParams.set("cod", body?.cod ? "1" : "0");
    quoteUrl.searchParams.set("declared_value", String(cartValue));

    const quoteResponse = await fetch(quoteUrl, { headers: { Authorization: `Bearer ${authData.token}` }, cache: "no-store" });
    const quoteData = await quoteResponse.json();
    const couriers = quoteData?.data?.available_courier_companies || [];
    if (!quoteResponse.ok || !couriers.length) return NextResponse.json({ error: "No Shiprocket courier is available for this PIN code." }, { status: 422 });

    const cheapest = couriers.reduce((current: { rate: number }, courier: { rate?: number }) => Number(courier.rate || Infinity) < Number(current.rate || Infinity) ? courier : current, couriers[0]);
    const shiprocketRate = Number(cheapest.rate);
    const shippingInr = shiprocketRate <= 100 ? 99 : shiprocketRate + 20;
    return NextResponse.json({ shippingInr, courier: cheapest.courier_name, estimatedDays: cheapest.estimated_delivery_days, weightKg: weight });
  } catch {
    return NextResponse.json({ error: "Unable to calculate shipping right now." }, { status: 502 });
  }
}
