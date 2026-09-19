const path = require("path");
const express = require("express");
const { config } = require("./config");
const { store } = require("./store");
const { apiRouter } = require("./routes/api");
const { webhookRouter } = require("./routes/webhook");

store.load();

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api", apiRouter);
app.use("/webhook", webhookRouter);

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

app.use((req, res) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/webhook")) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }
  return res.status(404).sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(config.port, () => {
  const wards = store.listWards().map((ward) => ward.shortName).join(" + ");
  console.log(`Ubuntu Code locator listening on http://localhost:${config.port}`);
  console.log(`Pilot: ${wards}, Mutasa Central (${store.listEntries().length} entries)`);
  console.log("Web demo:   /");
  console.log("Admin:      /admin");
  console.log("WhatsApp:   POST /webhook/whatsapp");
});
