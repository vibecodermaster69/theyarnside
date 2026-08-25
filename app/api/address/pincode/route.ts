import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const pincode = request.nextUrl.searchParams.get("pincode")?.trim() || "";
  if (!/^\d{6}$/.test(pincode)) return NextResponse.json({ error: "Enter a valid 6-digit PIN code." }, { status: 400 });

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, { cache: "no-store" });
    const payload = await response.json();
    const result = payload?.[0];
    const offices = result?.PostOffice || [];
    if (!response.ok || result?.Status !== "Success" || !offices.length) return NextResponse.json({ error: "This PIN code could not be found." }, { status: 404 });

    const firstOffice = offices[0];
    return NextResponse.json({
      valid: true,
      pincode,
      city: firstOffice.District || firstOffice.Block || firstOffice.Name,
      state: firstOffice.State,
      district: firstOffice.District,
      postOffices: offices.map((office: { Name: string }) => office.Name),
    });
  } catch {
    return NextResponse.json({ error: "PIN code validation is temporarily unavailable." }, { status: 502 });
  }
}
