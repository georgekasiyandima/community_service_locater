const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { config } = require("./config");
const seed = require("./data/seed-data");

const DATA_DIR = path.join(__dirname, "..", "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

function nowIso() {
  return new Date().toISOString();
}

function hashPhone(phone) {
  return crypto
    .createHash("sha256")
    .update(`${config.logSalt}:${phone || "unknown"}`)
    .digest("hex")
    .slice(0, 16);
}

function compact(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w]/g, "");
}

function createEmptyStore() {
  return {
    seedVersion: seed.SEED_VERSION,
    wards: seed.wards.map((ward) => ({ ...ward })),
    admins: seed.admins.map((admin) => ({ ...admin })),
    entries: seed.entries.map((entry) => ({
      ...entry,
      statusUpdatedAt: nowIso(),
      statusUpdatedBy: "seed"
    })),
    sessions: {},
    queryLog: [],
    createdAt: nowIso()
  };
}

class Store {
  constructor() {
    this.data = null;
  }

  load() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(STORE_PATH)) {
      this.data = createEmptyStore();
      this.save();
      return this;
    }
    this.data = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
    if (this.data.seedVersion !== seed.SEED_VERSION || !Array.isArray(this.data.wards)) {
      this.data = createEmptyStore();
      this.save();
    }
    return this;
  }

  reset() {
    this.data = createEmptyStore();
    this.save();
    return this;
  }

  save() {
    fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2));
  }

  listWards() {
    return this.data.wards;
  }

  getWard(wardId) {
    const id = wardId || config.defaultWardId;
    return this.data.wards.find((ward) => ward.id === id) || this.data.wards[0];
  }

  listEntries({ type, types, wardId } = {}) {
    const wanted = types || (type ? [type] : null);
    return this.data.entries.filter((entry) => {
      if (wardId && entry.wardId !== wardId) return false;
      if (wanted && !wanted.includes(entry.type)) return false;
      return true;
    });
  }

  findEntry(query, wardId) {
    const needle = compact(query);
    if (!needle) return null;
    const pool = this.listEntries({ wardId });
    return (
      pool.find((entry) => compact(entry.code) === needle) ||
      pool.find((entry) => compact(entry.name) === needle) ||
      pool.find((entry) => needle.length >= 6 && compact(entry.name).includes(needle)) ||
      null
    );
  }

  updateEntry(entryId, patch) {
    const entry = this.data.entries.find((item) => item.id === entryId);
    if (!entry) return null;
    Object.assign(entry, patch);
    this.save();
    return entry;
  }

  findAdminByPhone(phone) {
    const normalised = String(phone || "").replace(/\s+/g, "");
    return (
      this.data.admins.find((admin) => {
        if (!admin.active) return false;
        return admin.phoneNumber === normalised;
      }) || null
    );
  }

  isAdminPhone(phone) {
    const normalised = String(phone || "").replace(/\s+/g, "");
    if (this.findAdminByPhone(normalised)) return true;
    return config.adminPhones.includes(normalised);
  }

  getSession(fromNumber) {
    return this.data.sessions[fromNumber] || null;
  }

  setSession(fromNumber, patch) {
    if (!fromNumber) return null;
    this.data.sessions[fromNumber] = {
      ...(this.data.sessions[fromNumber] || {}),
      ...patch,
      updatedAt: nowIso()
    };
    this.save();
    return this.data.sessions[fromNumber];
  }

  logQuery({ fromNumber, queryType, matchedEntryId, rawText, wardId }) {
    this.data.queryLog.push({
      id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fromHash: hashPhone(fromNumber),
      queryType,
      wardId: wardId || null,
      matchedEntryId: matchedEntryId || null,
      rawPreview: String(rawText || "").slice(0, 40),
      timestamp: nowIso()
    });
    if (this.data.queryLog.length > 500) {
      this.data.queryLog = this.data.queryLog.slice(-400);
    }
    this.save();
  }

  getMetrics() {
    const entries = this.data.entries;
    const byType = {};
    for (const entry of entries) {
      byType[entry.type] = (byType[entry.type] || 0) + 1;
    }
    const attention = entries.filter((entry) =>
      ["closed", "broken"].includes(entry.status)
    );
    const last24h = Date.now() - 24 * 60 * 60 * 1000;
    const recentQueries = this.data.queryLog.filter(
      (item) => new Date(item.timestamp).getTime() >= last24h
    );

    return {
      wards: this.data.wards,
      totals: {
        wards: this.data.wards.length,
        entries: entries.length,
        clinics: byType.clinic || 0,
        boreholes: byType.borehole || 0,
        schools: byType.school || 0,
        churches: byType.church || 0,
        needingAttention: attention.length,
        queries: this.data.queryLog.length,
        queriesLast24h: recentQueries.length
      },
      lastUpdate:
        entries
          .slice()
          .sort((a, b) =>
            String(b.statusUpdatedAt).localeCompare(String(a.statusUpdatedAt))
          )[0] || null
    };
  }

  recentQueries(limit = 12) {
    return this.data.queryLog.slice(-limit).reverse();
  }
}

const store = new Store();

module.exports = { store, STORE_PATH, hashPhone };
