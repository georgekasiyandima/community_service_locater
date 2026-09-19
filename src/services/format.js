const STATUS_LABELS = {
  open: "OPEN",
  closed: "CLOSED",
  working: "WORKING",
  broken: "BROKEN"
};

function statusMark(status) {
  if (status === "open" || status === "working") return "●";
  return "○";
}

function formatEntry(entry) {
  const status = STATUS_LABELS[entry.status] || String(entry.status).toUpperCase();
  let line = `${statusMark(entry.status)} ${entry.code} · ${entry.name} — ${status}`;
  if (entry.locationNote) line += `\n  ${entry.locationNote}`;
  if (entry.contact) line += `\n  ${entry.contact}`;
  if (entry.extraInfo) line += `\n  ${entry.extraInfo}`;
  return line;
}

function formatEntries(entries, heading, emptyText) {
  if (!entries.length) {
    return emptyText || "No entries found yet for this ward. Reply HELP for options.";
  }
  const lines = [heading, ""].concat(entries.map(formatEntry));
  const needsAttention = entries.filter((entry) =>
    ["closed", "broken"].includes(entry.status)
  );
  if (needsAttention.length) {
    lines.push("");
    lines.push(
      `${needsAttention.length} need attention. Reply HELP if this does not match what you see.`
    );
  }
  return lines.join("\n");
}

function buildMenuReply(ward) {
  return [
    `Ubuntu Code · ${ward.name}`,
    `${ward.district} · ${ward.area}`,
    "",
    "Reply 14 for Bvumba or 15 for Sherukuru.",
    "",
    "Then one word:",
    "CLINIC · BOREHOLE · SCHOOL",
    "CHURCH · POLICE · SHOP · DAM",
    "LIST — every entry in this ward",
    "",
    "Admins: UPDATE BOREHOLE2 WORKING"
  ].join("\n");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toTwiml(text) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(text)}</Message></Response>`;
}

module.exports = {
  formatEntry,
  formatEntries,
  buildMenuReply,
  toTwiml,
  STATUS_LABELS
};
