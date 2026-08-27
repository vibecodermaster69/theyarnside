/**
 * One-off check that Zoho SMTP accepts our mail and that the inquiry template
 * renders correctly in a real inbox. Nothing in the app calls this.
 *
 *   npx tsx --env-file=.env scripts/send-test-inquiry-email.ts you@example.com
 *
 * The address you pass goes on the Cc line, standing in for the customer, so
 * you can see exactly what they would receive.
 */
import nodemailer from "nodemailer";
import {
  inquiryEmailHtml,
  inquirySubject,
  inquiryTextBody,
  type InquiryEmailData,
} from "../emails/inquiryNotification";

const host = process.env.ZOHO_SMTP_HOST;
const port = Number(process.env.ZOHO_SMTP_PORT || "465");
const user = process.env.ZOHO_SMTP_USER;
const password = process.env.ZOHO_SMTP_PASSWORD;
const inquiryTo = process.env.INQUIRY_TO_EMAIL || user;

const ccAddress = process.argv[2];

function fail(message: string): never {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

if (!host || !user || !password) {
  fail(
    "Missing SMTP settings. Add ZOHO_SMTP_HOST, ZOHO_SMTP_USER and ZOHO_SMTP_PASSWORD to .env",
  );
}
if (!ccAddress) {
  fail("Pass an address to Cc, e.g. npx tsx --env-file=.env scripts/send-test-inquiry-email.ts you@example.com");
}

const data: InquiryEmailData = {
  inquiryId: 0,
  customerName: "Meera Krishnan",
  customerEmail: ccAddress,
  category: "Flowers & Bouquets",
  details:
    "I'd love a bouquet of about twelve stems — soft peach roses with sage leaves — for my sister's engagement on 14 September.\n\nCould it be made a little larger than the ones on your shop page, and would you be able to match a fabric swatch I have?",
  receivedAt: new Date().toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }),
};

async function main() {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  console.log(`\n  Connecting to ${host}:${port} as ${user}...`);
  await transporter.verify();
  console.log("  ✓ SMTP connection and credentials accepted");

  const info = await transporter.sendMail({
    from: `THE YARN SIDE <${user}>`,
    to: inquiryTo,
    cc: ccAddress,
    subject: `[TEST] ${inquirySubject(data)}`,
    text: inquiryTextBody(data),
    html: inquiryEmailHtml(data),
  });

  console.log(`  ✓ Sent to ${inquiryTo}, Cc ${ccAddress}`);
  console.log(`    message id: ${info.messageId}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(`Send failed: ${message}`);
});
