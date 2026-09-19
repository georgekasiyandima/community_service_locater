const { store } = require("./store");
const { config } = require("./config");
const { routeCommunityQuery, matchWardCommand, matchWardHint } = require("./services/queryService");
const { routeAdminCommand } = require("./services/adminService");
const { buildMenuReply } = require("./services/format");

function normalizeIncoming(body) {
  return String(body || "").replace(/\s+/g, " ").trim();
}

function resolveWardId({ from, messageText, wardId }) {
  if (wardId) {
    store.setSession(from, { wardId });
    return wardId;
  }
  const command = matchWardCommand(messageText);
  if (command) {
    store.setSession(from, { wardId: command });
    return command;
  }
  const hint = matchWardHint(messageText);
  if (hint) {
    store.setSession(from, { wardId: hint });
    return hint;
  }
  const session = store.getSession(from);
  return (session && session.wardId) || config.defaultWardId;
}

function handleIncomingMessage({ from, body, forceRole, wardId }) {
  const senderNumber = String(from || "").replace(/\s+/g, "");
  const messageText = normalizeIncoming(body);
  const currentWardId = resolveWardId({
    from: senderNumber,
    messageText,
    wardId
  });

  if (matchWardCommand(messageText)) {
    const ward = store.getWard(currentWardId);
    return {
      ok: true,
      intent: "ward",
      role: forceRole || "community",
      senderNumber,
      wardId: currentWardId,
      replyText: `Now using ${ward.name}.\n\n${buildMenuReply(ward)}`
    };
  }

  const treatAsAdmin =
    forceRole === "admin" || (forceRole !== "community" && store.isAdminPhone(senderNumber));

  const result = treatAsAdmin
    ? routeAdminCommand(senderNumber || "+263771000001", messageText, currentWardId)
    : routeCommunityQuery(messageText, senderNumber, currentWardId);

  return {
    ...result,
    role: treatAsAdmin ? "admin" : "community",
    senderNumber,
    wardId: result.wardId || currentWardId
  };
}

module.exports = { handleIncomingMessage, normalizeIncoming };
