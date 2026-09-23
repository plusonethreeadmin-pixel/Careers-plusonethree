var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var PHONE_DIGIT_LENGTH = 10;
var WHY_YOU_MAX = 500;
var LINKEDIN_RE = /^https?:\/\/.+/i;
var ROLES = /* @__PURE__ */ new Set([
  "creative-designer",
  "operations",
  "marketeer",
  "email-marketeer",
  "content-strategist",
  "customer-relation-manager",
  "other"
]);
var WORK_MODES = /* @__PURE__ */ new Set(["in-person", "remote"]);
var ROLE_LABELS = {
  "creative-designer": "Creative Designer",
  operations: "Operations",
  marketeer: "Marketeer",
  "email-marketeer": "Email Marketeer",
  "content-strategist": "Content Strategist",
  "customer-relation-manager": "Customer's Relation Manager",
  other: "Other"
};
var WORK_MODE_LABELS = {
  "in-person": "In-Person",
  remote: "Remote"
};
function corsHeaders(env, request) {
  const configured = env.ALLOWED_ORIGIN || "*";
  const requestOrigin = request?.headers?.get("Origin") || "";
  let allow = "*";
  if (configured !== "*") {
    const allowed = configured.split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean);
    const normalized = requestOrigin.replace(/\/$/, "");
    if (normalized && allowed.includes(normalized)) {
      allow = requestOrigin;
    } else {
      allow = allowed[0] || "*";
    }
  }
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin"
  };
}
__name(corsHeaders, "corsHeaders");
function jsonResponse(env, body, status, request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(env, request)
    }
  });
}
__name(jsonResponse, "jsonResponse");
function requireString(value, field, maxLen) {
  if (typeof value !== "string") {
    return { ok: false, code: `invalid_${field}`, message: `${field} is required` };
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, code: `invalid_${field}`, message: `${field} is required` };
  }
  if (maxLen && trimmed.length > maxLen) {
    return { ok: false, code: `invalid_${field}`, message: `${field} is too long` };
  }
  return { ok: true, value: trimmed };
}
__name(requireString, "requireString");
function validateApplication(body) {
  const fullName = requireString(body?.fullName, "full_name", 200);
  if (!fullName.ok) return fullName;
  const emailRaw = requireString(body?.email, "email", 254);
  if (!emailRaw.ok) return emailRaw;
  const email = emailRaw.value.toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, code: "invalid_email", message: "invalid email format" };
  }
  const contactRaw = requireString(body?.contactNumber, "contact_number", 30);
  if (!contactRaw.ok) return contactRaw;
  const contactNumber = contactRaw.value.replace(/\D/g, "");
  if (contactNumber.length !== PHONE_DIGIT_LENGTH) {
    return { ok: false, code: "invalid_phone", message: "phone must be a 10-digit number" };
  }
  const linkedinRaw = requireString(body?.linkedin, "linkedin_url", 500);
  if (!linkedinRaw.ok) return linkedinRaw;
  const linkedinUrl = linkedinRaw.value;
  if (!LINKEDIN_RE.test(linkedinUrl)) {
    return { ok: false, code: "invalid_linkedin", message: "linkedin must be a valid URL" };
  }
  let socialHandle = null;
  if (body?.social != null && String(body.social).trim()) {
    const social = requireString(body.social, "social_handle", 120);
    if (!social.ok) return social;
    socialHandle = social.value;
  }
  const role = body?.role != null ? String(body.role).trim() : "";
  if (!ROLES.has(role)) {
    return { ok: false, code: "invalid_role", message: "unknown role" };
  }
  const workMode = body?.workMode != null ? String(body.workMode).trim() : "";
  if (!WORK_MODES.has(workMode)) {
    return { ok: false, code: "invalid_work_mode", message: "unknown work mode" };
  }
  const whyRaw = requireString(body?.whyYou, "why_you", WHY_YOU_MAX);
  if (!whyRaw.ok) return whyRaw;
  return {
    ok: true,
    row: {
      full_name: fullName.value,
      contact_number: contactNumber,
      email,
      linkedin_url: linkedinUrl,
      social_handle: socialHandle,
      role,
      work_mode: workMode,
      why_you: whyRaw.value
    },
    display: {
      fullName: fullName.value,
      contactNumber,
      email,
      linkedinUrl,
      socialHandle,
      roleLabel: ROLE_LABELS[role] || role,
      workModeLabel: WORK_MODE_LABELS[workMode] || workMode,
      whyYou: whyRaw.value
    }
  };
}
__name(validateApplication, "validateApplication");
function supabaseHeaders(env) {
  return {
    apikey: env.SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal"
  };
}
__name(supabaseHeaders, "supabaseHeaders");
async function insertApplication(env, row) {
  const url = `${env.SUPABASE_URL}/rest/v1/career_applications`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: supabaseHeaders(env),
      body: JSON.stringify(row)
    });
    const text = await res.text();
    if (res.ok) return { ok: true };
    if (res.status === 409 || text.includes("23505")) {
      return { ok: false, duplicate: true };
    }
    console.error("supabase insert failed", { status: res.status, body: text });
    return { ok: false, status: res.status };
  } catch (err) {
    console.error("supabase network error", err?.message || err);
    return { ok: false, status: 0 };
  }
}
__name(insertApplication, "insertApplication");
var EMAIL = {
  pageBg: "#e3f0f5",
  cardBg: "#ffffff",
  headerBg: "#ffffff",
  border: "#93bccd",
  borderSoft: "#c5d8e0",
  text: "#1a1a1a",
  textMuted: "#50636b",
  label: "#50636b",
  accent: "#c4ff3c",
  accentText: "#1a1a1a",
  link: "#50636b",
  footer: "#50636b",
  quoteBg: "#e3f0f5",
  logoUrl: "https://www.plusonethree.com/assets/logo.png",
  siteUrl: "https://www.plusonethree.com"
};
function escapeHtml(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
__name(escapeHtml, "escapeHtml");
function emailFooterHtml() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:0 0 16px;">
        <a href="${EMAIL.siteUrl}" style="text-decoration:none;">
          <img src="${EMAIL.logoUrl}" alt="PlusOneThree" width="180" height="23" style="display:block;width:180px;max-width:100%;height:auto;border:0;" />
        </a>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:0 0 14px;font-size:11px;line-height:1.4;letter-spacing:0.1em;text-transform:uppercase;color:${EMAIL.textMuted};">
        Endurance Fuel System
      </td>
    </tr>
    <tr>
      <td style="padding:14px 0 0;border-top:1px solid ${EMAIL.borderSoft};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="left" valign="middle" style="padding:0;font-size:10px;line-height:1.4;letter-spacing:0.06em;text-transform:uppercase;color:${EMAIL.footer};">
              &copy;2026 PLUSONETHREE. All Rights Reserved.
            </td>
            <td align="right" valign="middle" style="padding:0 0 0 12px;font-size:10px;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL.text};font-weight:700;white-space:nowrap;">
              Fueling you soon
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}
__name(emailFooterHtml, "emailFooterHtml");
function emailLayout(title, bodyHtml, preheader = "") {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;width:100% !important;background-color:${EMAIL.pageBg};font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${EMAIL.pageBg};">${escapeHtml(preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${EMAIL.pageBg}" style="background-color:${EMAIL.pageBg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" bgcolor="${EMAIL.cardBg}" style="width:100%;max-width:560px;background-color:${EMAIL.cardBg};border:1px solid ${EMAIL.border};">
          <tr>
            <td height="4" bgcolor="${EMAIL.accent}" style="background-color:${EMAIL.accent};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td bgcolor="${EMAIL.headerBg}" style="padding:24px 32px 20px;background-color:${EMAIL.headerBg};border-bottom:1px solid ${EMAIL.borderSoft};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 0 14px;">
                    <a href="${EMAIL.siteUrl}" style="text-decoration:none;">
                      <img src="${EMAIL.logoUrl}" alt="PlusOneThree" width="160" height="20" style="display:block;width:160px;max-width:100%;height:auto;border:0;" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:22px;line-height:1.25;font-weight:700;letter-spacing:-0.02em;text-transform:uppercase;color:${EMAIL.text};">${escapeHtml(title)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="${EMAIL.cardBg}" style="padding:28px 32px;background-color:${EMAIL.cardBg};color:${EMAIL.text};font-size:15px;line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td bgcolor="${EMAIL.cardBg}" style="padding:20px 32px 28px;background-color:${EMAIL.cardBg};border-top:1px solid ${EMAIL.borderSoft};">
              ${emailFooterHtml()}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
__name(emailLayout, "emailLayout");
function emailFieldRow(label, valueHtml) {
  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid ${EMAIL.borderSoft};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="130" valign="top" style="width:130px;padding:0 16px 0 0;font-size:11px;line-height:1.4;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${EMAIL.label};">${escapeHtml(label)}</td>
          <td valign="top" style="padding:0;font-size:15px;line-height:1.5;color:${EMAIL.text};">${valueHtml}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}
__name(emailFieldRow, "emailFieldRow");
function emailLink(href, label) {
  return `<a href="${escapeHtml(href)}" style="color:${EMAIL.link};text-decoration:underline;word-break:break-all;">${escapeHtml(label)}</a>`;
}
__name(emailLink, "emailLink");
function emailQuoteBlock(label, text) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
    <tr>
      <td width="4" bgcolor="${EMAIL.accent}" style="background-color:${EMAIL.accent};font-size:0;line-height:0;">&nbsp;</td>
      <td bgcolor="${EMAIL.quoteBg}" style="padding:16px 18px;background-color:${EMAIL.quoteBg};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:0 0 8px;font-size:11px;line-height:1.4;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${EMAIL.label};">${escapeHtml(label)}</td>
          </tr>
          <tr>
            <td style="padding:0;font-size:15px;line-height:1.6;color:${EMAIL.text};white-space:pre-wrap;">${escapeHtml(text)}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}
__name(emailQuoteBlock, "emailQuoteBlock");
function buildHrEmailHtml(display) {
  const socialRow = display.socialHandle ? emailFieldRow("Instagram / X", escapeHtml(display.socialHandle)) : "";
  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      ${emailFieldRow("Name", escapeHtml(display.fullName))}
      ${emailFieldRow("Email", emailLink(`mailto:${display.email}`, display.email))}
      ${emailFieldRow("Phone", escapeHtml(display.contactNumber))}
      ${emailFieldRow("LinkedIn", emailLink(display.linkedinUrl, display.linkedinUrl))}
      ${socialRow}
      ${emailFieldRow("Role", `<span style="color:${EMAIL.text};font-weight:700;">${escapeHtml(display.roleLabel)}</span>`)}
      ${emailFieldRow("Work mode", escapeHtml(display.workModeLabel))}
    </table>
    ${emailQuoteBlock("Why you", display.whyYou)}`;
  return emailLayout(
    "New careers application",
    body,
    `New application from ${display.fullName} for ${display.roleLabel}`
  );
}
__name(buildHrEmailHtml, "buildHrEmailHtml");
function buildHrEmailText(display) {
  const lines = [
    "New careers application \u2014 PlusOneThree",
    "",
    `Name: ${display.fullName}`,
    `Email: ${display.email}`,
    `Phone: ${display.contactNumber}`,
    `LinkedIn: ${display.linkedinUrl}`
  ];
  if (display.socialHandle) lines.push(`Instagram / X: ${display.socialHandle}`);
  lines.push(
    `Role: ${display.roleLabel}`,
    `Work mode: ${display.workModeLabel}`,
    "",
    "Why you:",
    display.whyYou
  );
  return lines.join("\n");
}
__name(buildHrEmailText, "buildHrEmailText");
function buildApplicantEmailHtml(display) {
  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:0 0 16px;font-size:16px;line-height:1.5;color:${EMAIL.text};">Hi ${escapeHtml(display.fullName)},</td>
      </tr>
      <tr>
        <td style="padding:0 0 20px;font-size:15px;line-height:1.6;color:${EMAIL.textMuted};">
          Thanks for applying for
          <span style="color:${EMAIL.text};font-weight:700;">${escapeHtml(display.roleLabel)}</span>
          at PlusOneThree.
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${EMAIL.quoteBg}" style="background-color:${EMAIL.quoteBg};border:1px solid ${EMAIL.borderSoft};">
            <tr>
              <td width="4" bgcolor="${EMAIL.accent}" style="background-color:${EMAIL.accent};">&nbsp;</td>
              <td style="padding:18px 20px;font-size:14px;line-height:1.6;color:${EMAIL.textMuted};">
                We received your application. Our team will review it and reach out if there is a fit.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  return emailLayout(
    "Application received",
    body,
    `Your PlusOneThree application for ${display.roleLabel} was received`
  );
}
__name(buildApplicantEmailHtml, "buildApplicantEmailHtml");
function buildApplicantEmailText(display) {
  return [
    `Hi ${display.fullName},`,
    "",
    `Thanks for applying for ${display.roleLabel} at PlusOneThree.`,
    "We received your application and will be in touch if there is a fit."
  ].join("\n");
}
__name(buildApplicantEmailText, "buildApplicantEmailText");
async function sendResendEmail(env, { to, subject, html, text }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [to],
      subject,
      html,
      text
    })
  });
  if (res.ok) return { ok: true };
  const body = await res.text();
  console.error("resend failed", { status: res.status, body, to });
  return { ok: false, status: res.status };
}
__name(sendResendEmail, "sendResendEmail");
async function handlePost(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(env, { success: false, error: "invalid_json" }, 400, request);
  }
  const validated = validateApplication(body);
  if (!validated.ok) {
    return jsonResponse(
      env,
      { success: false, error: validated.code, message: validated.message },
      400,
      request
    );
  }
  const inserted = await insertApplication(env, validated.row);
  if (inserted.duplicate) {
    return jsonResponse(env, { error: "duplicate" }, 409, request);
  }
  if (!inserted.ok) {
    return jsonResponse(env, { success: false, error: "db_unavailable" }, 503, request);
  }
  const hr = await sendResendEmail(env, {
    to: env.CAREERS_NOTIFY_EMAIL,
    subject: `New application: ${validated.display.roleLabel} \u2014 ${validated.display.fullName}`,
    html: buildHrEmailHtml(validated.display),
    text: buildHrEmailText(validated.display)
  });
  if (!hr.ok) {
    console.error("HR email failed after DB insert", { id: validated.display.email });
  }
  if (env.SEND_APPLICANT_CONFIRMATION === "true") {
    await sendResendEmail(env, {
      to: validated.display.email,
      subject: "We received your PlusOneThree application",
      html: buildApplicantEmailHtml(validated.display),
      text: buildApplicantEmailText(validated.display)
    });
  }
  return jsonResponse(env, { success: true }, 202, request);
}
__name(handlePost, "handlePost");
var index_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env, request) });
    }
    if (request.method === "POST") {
      return handlePost(request, env);
    }
    return jsonResponse(env, { success: false, error: "method_not_allowed" }, 405, request);
  }
};
export const HR_NOTIFY_EMAIL = 'admin@plusonethree.com'
export {
  index_default as default,
  ROLE_LABELS,
  WORK_MODE_LABELS,
  sendResendEmail,
  buildHrEmailHtml,
  buildHrEmailText
};
//# sourceMappingURL=index.js.map

