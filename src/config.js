require("dotenv").config();

function parsePhoneList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  defaultWardId: process.env.DEFAULT_WARD_ID || "mutasa-ward-14",
  adminPhones: parsePhoneList(
    process.env.ADMIN_PHONES || "+263771000001,+263771000002"
  ),
  adminPin: process.env.ADMIN_PIN || "2468",
  logSalt: process.env.LOG_SALT || "ubuntu-code-dev-salt",
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886"
  }
};

module.exports = { config, parsePhoneList };
