const { store } = require("../store");
const { config } = require("../config");
const { formatEntries, buildMenuReply } = require("./format");

const ALLOWED_STATUS = {
  clinic: ["open", "closed"],
  school: ["open", "closed"],
  church: ["open", "closed"],
  police: ["open", "closed"],
  shop: ["open", "closed"],
  borehole: ["working", "broken"],
  water: ["working", "broken"]
};

const STATUS_ALIASES = {
  open: "open",
  opened: "open",
  closed: "closed",
  close: "closed",
  working: "working",
  works: "working",
  ok: "working",
  broken: "broken",
  down: "broken",
  dry: "broken"
};

const QUERY_WORDS = /^(clinic|borehole|school|hospital|water|schools|church|police|shop|dam|osborne|list)$/i;

function parseUpdateCommand(messageText) {
  const text = String(messageText || "").trim();
  const match = text.match(/^update\s+(.+)$/i);
  if (!match) return null;

  const parts = match[1].trim().split(/\s+/);
  if (parts.length < 2) return { error: "missing-status" };

  const statusToken = parts.pop().toLowerCase();
  const name = parts.join(" ");
  const status = STATUS_ALIASES[statusToken];
  if (!status) return { error: "bad-status", statusToken };
  return { name, status };
}

function listReply(wardId) {
  const ward = store.getWard(wardId);
  const entries = store.listEntries({ wardId: ward.id });
  return formatEntries(entries, `All services · ${ward.name} (${entries.length})`);
}

function applyUpdate({ name, status, admin, wardId }) {
  const entry =
    store.findEntry(name, wardId) ||
    store.findEntry(name, admin.wardId) ||
    store.findEntry(name);

  if (!entry) {
    return {
      ok: false,
      replyText: `Could not find "${name}". Reply LIST to see codes, e.g. BOREHOLE2.`
    };
  }

  const allowed = ALLOWED_STATUS[entry.type] || [];
  if (!allowed.includes(status)) {
    return {
      ok: false,
      replyText: `${entry.name} can be ${allowed.join(" or ").toUpperCase()}, not ${status.toUpperCase()}.`
    };
  }

  const updated = store.updateEntry(entry.id, {
    status,
    statusUpdatedAt: new Date().toISOString(),
    statusUpdatedBy: admin.id || admin.phoneNumber
  });

  return {
    ok: true,
    entry: updated,
    replyText: `Updated: ${updated.code} · ${updated.name} is now ${updated.status.toUpperCase()}.\nPeople who text ${updated.type.toUpperCase()} will see this immediately.`
  };
}

function routeAdminCommand(adminNumber, messageText, wardId) {
  const admin =
    store.findAdminByPhone(adminNumber) || {
      id: adminNumber,
      phoneNumber: adminNumber,
      name: "Allowlisted admin",
      wardId: wardId || config.defaultWardId,
      active: true
    };

  if (!store.isAdminPhone(adminNumber)) {
    return {
      ok: false,
      replyText: "Sorry, this number is not registered as an admin."
    };
  }

  const text = String(messageText || "").trim();
  const lower = text.toLowerCase();
  const currentWardId = wardId || admin.wardId || config.defaultWardId;

  if (!text || /^(help|menu|hi|hello|start)$/i.test(lower)) {
    return { ok: true, replyText: buildMenuReply(store.getWard(currentWardId)), wardId: currentWardId };
  }

  if (/^list all$/i.test(lower)) {
    const entries = store.listEntries();
    return {
      ok: true,
      wardId: currentWardId,
      replyText: formatEntries(entries, `Both wards · ${entries.length} services`)
    };
  }

  if (/^list$/i.test(lower)) {
    return { ok: true, wardId: currentWardId, replyText: listReply(currentWardId) };
  }

  if (QUERY_WORDS.test(lower)) {
    const { routeCommunityQuery } = require("./queryService");
    return routeCommunityQuery(text, adminNumber, currentWardId);
  }

  const parsed = parseUpdateCommand(text);
  if (!parsed) {
    return {
      ok: false,
      wardId: currentWardId,
      replyText: "Format: UPDATE <code> <status>\nExample: UPDATE BOREHOLE2 WORKING\nReply LIST to see codes."
    };
  }

  if (parsed.error === "missing-status") {
    return {
      ok: false,
      replyText: "Add a status. Example: UPDATE CLINIC1 CLOSED"
    };
  }

  if (parsed.error === "bad-status") {
    return {
      ok: false,
      replyText: `"${parsed.statusToken}" is not a status I know. Use OPEN, CLOSED, WORKING or BROKEN.`
    };
  }

  return applyUpdate({
    name: parsed.name,
    status: parsed.status,
    admin,
    wardId: currentWardId
  });
}

function updateFromDashboard({ code, status, pin }) {
  if (String(pin) !== String(config.adminPin)) {
    return { ok: false, error: "Wrong admin PIN." };
  }
  const admin = store.findAdminByPhone(config.adminPhones[0]) || {
    id: "web-admin",
    phoneNumber: config.adminPhones[0],
    wardId: config.defaultWardId
  };
  return applyUpdate({ name: code, status, admin });
}

module.exports = {
  routeAdminCommand,
  parseUpdateCommand,
  updateFromDashboard,
  applyUpdate
};
