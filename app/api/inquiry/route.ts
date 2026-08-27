import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  inquiryEmailHtml,
  inquirySubject,
  inquiryTextBody,
  type InquiryEmailData,
} from "@/emails/inquiryNotification";

// nodemailer needs the Node runtime; it does not run on the Edge runtime.
export const runtime = "nodejs";

type InquiryPayload = {
  inquiryId?: number;
  customerName?: string;
  customerEmail?: string;
  category?: string;
  details?: string;
};

export async function POST(request: NextRequest) {
  const host = process.env.ZOHO_SMTP_HOST;
  const port = Number(process.env.ZOHO_SMTP_PORT || "465");
  const user = process.env.ZOHO_SMTP_USER;
  const password = process.env.ZOHO_SMTP_PASSWORD;
  const inquiryTo = process.env.INQUIRY_TO_EMAIL || user;

  if (!host || !user || !password) {
    return NextResponse.json({ error: "Inquiry email is not configured on the server." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as InquiryPayload | null;
  const customerName = body?.customerName?.trim() || "";
  const customerEmail = body?.customerEmail?.trim() || "";
  const category = body?.category?.trim() || "";
  const details = body?.details?.trim() || "";
  const inquiryId = Number(body?.inquiryId);

  if (!customerName || !category || !details) {
    return NextResponse.json({ error: "Name, category and details are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!Number.isFinite(inquiryId) || inquiryId <= 0) {
    return NextResponse.json({ error: "Missing inquiry reference." }, { status: 400 });
  }

  const data: InquiryEmailData = {
    inquiryId,
    customerName,
    customerEmail,
    category,
    details,
    receivedAt: new Date().toLocaleString("en-IN", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }),
  };

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: password },
    });

    // The customer is on Cc so both sides can see the thread. No Reply-To:
    // pointing it at the customer would send their own reply back to them.
    await transporter.sendMail({
      from: `THE YARN SIDE <${user}>`,
      to: inquiryTo,
      cc: customerEmail,
      subject: inquirySubject(data),
      text: inquiryTextBody(data),
      html: inquiryEmailHtml(data),
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Inquiry email failed", error);
    return NextResponse.json({ error: "We could not send the inquiry email." }, { status: 502 });
  }
}
