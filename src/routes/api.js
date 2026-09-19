const express = require("express");
const { store } = require("../store");
const { config } = require("../config");
const { handleIncomingMessage } = require("../router");
const { updateFromDashboard } = require("../services/adminService");

const apiRouter = express.Router();

apiRouter.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "ubuntu-code-community-service-locator",
    defaultWardId: config.defaultWardId,
    time: new Date().toISOString()
  });
});

apiRouter.get("/ward", (_req, res) => {
  res.json({
    wards: store.listWards(),
    disclaimer: "Names are local. Statuses are sample until field-verified."
  });
});

apiRouter.get("/services", (req, res) => {
  const type = req.query.type || undefined;
  const wardId = req.query.wardId || undefined;
  res.json({
    wards: store.listWards(),
    entries: store.listEntries({ type, wardId })
  });
});

apiRouter.get("/metrics", (_req, res) => {
  res.json({
    ...store.getMetrics(),
    recentQueries: store.recentQueries(8)
  });
});

apiRouter.post("/demo/message", (req, res) => {
  const { from, body, role, wardId } = req.body || {};
  const result = handleIncomingMessage({
    from: from || (role === "admin" ? config.adminPhones[0] : "+263771239000"),
    body,
    forceRole: role,
    wardId
  });
  res.json(result);
});

apiRouter.post("/admin/update", (req, res) => {
  const { code, status, pin } = req.body || {};
  const result = updateFromDashboard({ code, status, pin });
  if (!result.ok) {
    return res.status(400).json(result);
  }
  return res.json(result);
});

apiRouter.post("/admin/verify-pin", (req, res) => {
  const ok = String((req.body || {}).pin) === String(config.adminPin);
  res.status(ok ? 200 : 401).json({ ok });
});

module.exports = { apiRouter };
