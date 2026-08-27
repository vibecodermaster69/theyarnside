export type InquiryEmailData = {
  inquiryId: number;
  customerName: string;
  customerEmail: string;
  category: string;
  details: string;
  receivedAt: string;
};

// The idea text is written by a stranger, so every interpolated value is
// escaped. Kept as a module rather than a loose .html file so the template
// ships with the serverless bundle instead of depending on the filesystem.
function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2br(value: string) {
  return value.replace(/\r?\n/g, "<br>");
}

export function inquirySubject(data: InquiryEmailData) {
  return `New inquiry #${data.inquiryId} \u2014 ${data.category} \u2014 ${data.customerName}`;
}

export function inquiryTextBody(data: InquiryEmailData) {
  return [
    `Inquiry #${data.inquiryId}`,
    `Name: ${data.customerName}`,
    `Email: ${data.customerEmail}`,
    `Item category: ${data.category}`,
    `Received: ${data.receivedAt}`,
    "",
    "The idea:",
    data.details,
  ].join("\n");
}

export function inquiryEmailHtml(data: InquiryEmailData) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>New inquiry — THE YARN SIDE</title>
</head>
<body style="margin:0; padding:0; background-color:#EFE8DC;">

<!-- Preheader: shown in the inbox list, hidden in the body -->
<div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; height:0; width:0;">
  ${esc(data.customerName)} would like a bespoke ${esc(data.category)} piece — full details inside.
</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#EFE8DC; padding:24px 12px;">
  <tr>
    <td align="center">

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; max-width:100%; background-color:#FFFFFF; border-radius:12px; overflow:hidden;">

        <!-- Masthead -->
        <tr>
          <td style="background-color:#8FA293; padding:26px 32px; text-align:center;">
            <div style="font-family:Georgia,'Times New Roman',serif; font-size:20px; letter-spacing:0.14em; color:#FFFFFF; text-transform:uppercase;">
              The Yarn Side
            </div>
            <div style="font-family:Arial,Helvetica,sans-serif; font-size:11px; letter-spacing:0.1em; color:#E8EDE9; text-transform:uppercase; padding-top:7px;">
              May the yarn be with you
            </div>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:34px 32px 0 32px;">
            <div style="font-family:Arial,Helvetica,sans-serif; font-size:11px; font-weight:bold; letter-spacing:0.12em; color:#E07A69; text-transform:uppercase;">
              Bespoke Creations
            </div>
            <h1 style="margin:10px 0 0 0; font-family:Georgia,'Times New Roman',serif; font-size:27px; line-height:1.25; font-weight:normal; color:#4B3A32;">
              A new inquiry for a custom piece
            </h1>
            <p style="margin:16px 0 0 0; font-family:Arial,Helvetica,sans-serif; font-size:15px; line-height:1.65; color:#5E4C43;">
              Hi ${esc(data.customerName)} — thank you for reaching out. Here is a copy of everything you
              sent us. Anjali reads every inquiry herself and will reply within 24 to 48 hours to
              talk through fibre selection, sizing and timelines.
            </p>
          </td>
        </tr>

        <!-- Detail card -->
        <tr>
          <td style="padding:26px 32px 0 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F7F2EA; border-radius:10px;">
              <tr>
                <td style="padding:20px 22px;">

                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding:0 0 12px 0; font-family:Arial,Helvetica,sans-serif; font-size:12px; letter-spacing:0.06em; color:#8A7A70; text-transform:uppercase; width:40%;">Name</td>
                      <td style="padding:0 0 12px 0; font-family:Arial,Helvetica,sans-serif; font-size:15px; font-weight:bold; color:#4B3A32;">${esc(data.customerName)}</td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 12px 0; font-family:Arial,Helvetica,sans-serif; font-size:12px; letter-spacing:0.06em; color:#8A7A70; text-transform:uppercase;">Email</td>
                      <td style="padding:0 0 12px 0; font-family:Arial,Helvetica,sans-serif; font-size:15px; color:#4B3A32;">
                        <a href="mailto:${esc(data.customerEmail)}" style="color:#C25C4A; text-decoration:none;">${esc(data.customerEmail)}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 12px 0; font-family:Arial,Helvetica,sans-serif; font-size:12px; letter-spacing:0.06em; color:#8A7A70; text-transform:uppercase;">Item category</td>
                      <td style="padding:0 0 12px 0; font-family:Arial,Helvetica,sans-serif; font-size:15px; color:#4B3A32;">${esc(data.category)}</td>
                    </tr>
                    <tr>
                      <td style="padding:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; letter-spacing:0.06em; color:#8A7A70; text-transform:uppercase;">Received</td>
                      <td style="padding:0; font-family:Arial,Helvetica,sans-serif; font-size:15px; color:#4B3A32;">${esc(data.receivedAt)}</td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- The idea -->
        <tr>
          <td style="padding:26px 32px 0 32px;">
            <div style="font-family:Arial,Helvetica,sans-serif; font-size:11px; font-weight:bold; letter-spacing:0.1em; color:#8A7A70; text-transform:uppercase; padding-bottom:10px;">
              The idea
            </div>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="border-left:3px solid #E07A69; padding:2px 0 2px 16px; font-family:Georgia,'Times New Roman',serif; font-size:16px; line-height:1.7; color:#4B3A32; font-style:italic;">
                  ${nl2br(esc(data.details))}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Reference -->
        <tr>
          <td style="padding:28px 32px 0 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F0F3F1; border-radius:10px;">
              <tr>
                <td style="padding:16px 20px; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:#4B3A32;">
                  Just reply to this email to carry on the conversation &mdash; everyone stays on the thread.
                  <span style="color:#6E6058;">Reference <strong style="color:#4B3A32;">Inquiry #${data.inquiryId}</strong>.</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Rule -->
        <tr>
          <td style="padding:28px 32px 0 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr><td style="border-top:1px solid #E9E0D4; font-size:0; line-height:0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px 34px 32px;">
            <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:1.7; color:#8A7A70;">
              You are receiving this because an inquiry was submitted at
              <a href="https://theyarnside.in" style="color:#C25C4A; text-decoration:none;">theyarnside.in</a>.
              A copy has gone to our workshop inbox, so there is no need to send it again.
            </p>
            <p style="margin:14px 0 0 0; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:1.7; color:#8A7A70;">
              Questions about an existing order? Write to
              <a href="mailto:support@theyarnside.in" style="color:#C25C4A; text-decoration:none;">support@theyarnside.in</a><br>
              Handmade in India · THE YARN SIDE
            </p>
          </td>
        </tr>

      </table>

      <div style="font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#9C8F82; padding:18px 0 0 0;">
        THE YARN SIDE · theyarnside.in
      </div>

    </td>
  </tr>
</table>

</body>
</html>
`;
}
