import formData from "form-data";
import Mailgun from "mailgun.js";

let mgClient = null;

function getMailgunClient() {
  const key = process.env.MAILGUN_API_KEY;
  if (!key) {
    return null;
  }

  if (!mgClient) {
    mgClient = new Mailgun(formData).client({
      username: "api",
      key,
    });
  }
  return mgClient;
}

function getMailgunConfig() {
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM;
  const appBaseUrl = process.env.APP_BASE_URL || "";
  return {domain, from, appBaseUrl};
}

function isValidEmail(value) {
  return typeof value === "string" && value.includes("@");
}

function buildEventUrl(appBaseUrl, event) {
  const id = event?._id ?? event?.id ?? "";
  return `${appBaseUrl}/events/${id}`;
}

function formatLocation(loc) {
  if (!loc) {
    return "";
  }
  const parts = [loc.address, loc.city, loc.state, loc.postalCode].filter(
      Boolean);
  return parts.join(", ");
}

function formatDateTime(dateIso) {
  return new Date(dateIso).toLocaleString();
}

function escapeHtml(str) {
  return String(str)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");
}

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

async function sendMailgunMessage(message) {
  const mg = getMailgunClient();
  const {domain, from} = getMailgunConfig();

  if (!mg || !domain || !from) {
    return {ok: false};
  }

  await mg.messages.create(domain, {from, ...message});
  return {ok: true};
}

async function sendSingleHtmlEmail({to, subject, html}) {
  if (!isValidEmail(to)) {
    return {ok: false};
  }
  return sendMailgunMessage({to, subject, html});
}

async function sendBatchedTemplateEmail({
  recipients,
  subject,
  renderHtml,
  getVars,
  batchSize = 500,
}) {
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return {ok: false};
  }

  const validRecipients = recipients.filter((r) => isValidEmail(r?.email));
  if (validRecipients.length === 0) {
    return {ok: false};
  }

  const batches = chunk(validRecipients, batchSize);

  await Promise.all(
      batches.map(async (batch) => {
        const to = batch.map((r) => r.email);

        const recipientVariables = {};
        for (const r of batch) {
          recipientVariables[r.email] = getVars(r);
        }

        await sendMailgunMessage({
          to,
          subject,
          html: renderHtml(),
          "recipient-variables": JSON.stringify(recipientVariables),
        });
      })
  );

  return {ok: true};
}

export const sendNewEventEmailToUsers = async ({event, recipients}) => {
  const {appBaseUrl} = getMailgunConfig();
  const eventUrl = buildEventUrl(appBaseUrl, event);

  return sendBatchedTemplateEmail({
    recipients,
    subject: `New event: ${event.title}`,
    getVars: (r) => ({firstName: r.firstName || "there"}),
    renderHtml: () => `
      <div style="font-family: Arial, sans-serif; line-height: 1.5">
        <p>Hi %recipient.firstName%,</p>
        <p>A new event has been posted:</p>
        <h2 style="margin: 0 0 8px 0;">${escapeHtml(event.title)}</h2>
        <p style="margin: 0 0 8px 0;">${escapeHtml(event.description || "")}</p>
        <p><b>When:</b> ${formatDateTime(event.date)}</p>
        <p><b>Where:</b> ${escapeHtml(formatLocation(event.location))}</p>
        <p><a href="${eventUrl}">View event</a></p>
      </div>
    `,
  });
};

export const sendEventRegistrationEmail = async ({event, user}) => {
  const {appBaseUrl} = getMailgunConfig();
  const eventUrl = buildEventUrl(appBaseUrl, event);

  const to = user?.username;
  const firstName = user?.firstname || "";

  return sendSingleHtmlEmail({
    to,
    subject: `Registration confirmed: ${event.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5">
        <p>Hi ${escapeHtml(firstName || "there")},</p>
        <p>Your registration is confirmed for:</p>
        <h2 style="margin: 0 0 8px 0;">${escapeHtml(event.title)}</h2>
        <p><b>When:</b> ${formatDateTime(event.date)}</p>
        <p><b>Where:</b> ${escapeHtml(formatLocation(event.location))}</p>
        <p><b>Organizer:</b> ${escapeHtml(event.organizer || "")}</p>
        <p><a href="${eventUrl}">View event details</a></p>
        <p style="margin-top: 16px; color: #666">
          If you didn’t register, you can ignore this email.
        </p>
      </div>
    `,
  });
};

export const sendVaccinationMarkedEmail = async ({
  event,
  user,
  vaccination
}) => {
  const {appBaseUrl} = getMailgunConfig();
  const eventUrl = buildEventUrl(appBaseUrl, event);

  const to = user?.username;
  const firstName = user?.firstname || "";

  return sendSingleHtmlEmail({
    to,
    subject: `Vaccination updated: ${vaccination.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5">
        <p>Hi ${escapeHtml(firstName || "there")},</p>
        <p>A volunteer has updated your vaccination record:</p>
        <h2 style="margin: 0 0 8px 0;">${escapeHtml(vaccination.name)}</h2>
        <p style="margin: 0 0 12px 0;">${escapeHtml(
        vaccination.description || "")}</p>

        <p><b>Event:</b> ${escapeHtml(event.title)}</p>
        <p><b>When:</b> ${formatDateTime(event.date)}</p>
        <p><b>Where:</b> ${escapeHtml(formatLocation(event.location))}</p>

        <p><a href="${eventUrl}">View event</a></p>
        <p style="margin-top: 16px; color: #666">
          If you believe this is incorrect, please contact the organizer.
        </p>
      </div>
    `,
  });
};
