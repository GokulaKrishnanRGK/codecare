import formData from "form-data";
import Mailgun from "mailgun.js";

let mgClient = null;

function getMailgunClient() {
  const key = process.env.MAILGUN_API_KEY;
  if (!key) return null;

  if (!mgClient) {
    mgClient = new Mailgun(formData).client({
      username: "api",
      key,
    });
  }
  return mgClient;
}

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export const sendNewEventEmailToUsers = async ({ event, recipients }) => {

  const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
  const MAILGUN_FROM = process.env.MAILGUN_FROM;
  const APP_BASE_URL = process.env.APP_BASE_URL || "";

  const mg = getMailgunClient();

  if (!MAILGUN_DOMAIN || !MAILGUN_FROM) return;
  if (!recipients?.length) return;

  const eventUrl = `${APP_BASE_URL || ""}/events/${event._id}`;

  const batches = chunk(recipients, 500);

  await Promise.all(
      batches.map(async (batch) => {
        const toList = batch.map((r) => r.email);
        const recipientVariables = {};
        for (const r of batch) {
          recipientVariables[r.email] = { firstName: r.firstName };
        }

        await mg.messages.create(MAILGUN_DOMAIN, {
          from: MAILGUN_FROM,
          to: toList,
          subject: `New event: ${event.title}`,
          html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5">
            <p>Hi %recipient.firstName%,</p>
            <p>A new event has been posted:</p>
            <h2 style="margin: 0 0 8px 0;">${escapeHtml(event.title)}</h2>
            <p style="margin: 0 0 8px 0;">${escapeHtml(event.description || "")}</p>
            <p><b>When:</b> ${new Date(event.date).toLocaleString()}</p>
            <p><b>Where:</b> ${escapeHtml(formatLocation(event.location))}</p>
            <p><a href="${eventUrl}">View event</a></p>
          </div>
        `,
          "recipient-variables": JSON.stringify(recipientVariables),
        });
      })
  );
};

function formatLocation(loc) {
  if (!loc) return "";
  const parts = [loc.address, loc.city, loc.state, loc.postalCode].filter(Boolean);
  return parts.join(", ");
}

function escapeHtml(str) {
  return String(str)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");
}
