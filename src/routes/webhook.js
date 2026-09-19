const express = require("express");
const { handleIncomingMessage } = require("../router");
const { toTwiml } = require("../services/format");

const webhookRouter = express.Router();

webhookRouter.post("/whatsapp", (req, res) => {
  const from = String(req.body.From || req.body.from || "").replace(/^whatsapp:/, "");
  const body = req.body.Body || req.body.body || "";
  const result = handleIncomingMessage({ from, body });

  res.type("text/xml").send(toTwiml(result.replyText));
});

webhookRouter.get("/whatsapp", (_req, res) => {
  res.json({
    ok: true,
    service: "ubuntu-code-locator",
    hint: "Point Twilio's 'when a message comes in' webhook here as a POST."
  });
});

module.exports = { webhookRouter };
