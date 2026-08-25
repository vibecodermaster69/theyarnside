import { NextResponse } from "next/server";

const shiprocketBaseUrl = "https://apiv2.shiprocket.in/v1/external";

export async function GET() {
  const email = process.env.SHIPROCKET_API_EMAIL;
  const password = process.env.SHIPROCKET_API_PASSWORD;
  const pickupPostcode = process.env.SHIPROCKET_PICKUP_POSTCODE || "110001";
  const deliveryPostcode = "560001";
  const weight = Number(process.env.SHIPROCKET_DEFAULT_WEIGHT_KG || "0.5");

  if (!email || !password) {
    return NextResponse.json({ error: "Shiprocket credentials are not configured on the server." }, { status: 500 });
  }

  try {
    const authResponse = await fetch(`${shiprocketBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    const authData = await authResponse.json();
    if (!authResponse.ok || !authData.token) {
      return NextResponse.json({ error: "Shiprocket authentication failed.", details: authData }, { status: 502 });
    }

    const quoteUrl = new URL(`${shiprocketBaseUrl}/courier/serviceability/`);
    quoteUrl.searchParams.set("pickup_postcode", pickupPostcode);
    quoteUrl.searchParams.set("delivery_postcode", deliveryPostcode);
    quoteUrl.searchParams.set("weight", String(weight));
    quoteUrl.searchParams.set("cod", "0");

    const quoteResponse = await fetch(quoteUrl, {
      headers: { Authorization: `Bearer ${authData.token}` },
      cache: "no-store",
    });
    const quoteData = await quoteResponse.json();

    return NextResponse.json({
      test: {
        from: "New Delhi, 110001",
        to: "Bengaluru, 560001",
        pickupPostcode,
        deliveryPostcode,
        weightKg: weight,
        payment: "prepaid",
      },
      ok: quoteResponse.ok,
      status: quoteResponse.status,
      rates: quoteData?.data?.available_courier_companies || [],
      response: quoteData,
    }, { status: quoteResponse.ok ? 200 : 502 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Shipping test failed." }, { status: 500 });
  }
}
