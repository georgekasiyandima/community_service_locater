const { store } = require("../store");
const { formatEntries, buildMenuReply } = require("./format");

const INTENT_MAP = [
  { intent: "clinic", keywords: ["clinic", "clinics", "hospital", "health", "nurse", "doctor"] },
  { intent: "borehole", keywords: ["borehole", "boreholes", "well", "tap"] },
  { intent: "water", keywords: ["water"] },
  { intent: "dam", keywords: ["dam", "osborne"] },
  { intent: "school", keywords: ["school", "schools", "education", "ecd", "teacher"] },
  { intent: "church", keywords: ["church", "churches", "mission", "parish", "mass"] },
  { intent: "police", keywords: ["police", "station", "security"] },
  { intent: "shop", keywords: ["shop", "shops", "mill", "grinding", "meal", "store"] },
  { intent: "list", keywords: ["list", "all", "directory"] },
  { intent: "help", keywords: ["help", "menu", "hi", "hello", "start", "info"] }
];

const INTENT_TYPES = {
  clinic: ["clinic"],
  borehole: ["borehole"],
  water: ["borehole", "water"],
  dam: ["water"],
  school: ["school"],
  church: ["church"],
  police: ["police"],
  shop: ["shop"]
};

const INTENT_LABEL = {
  clinic: "Clinics",
  borehole: "Boreholes",
  water: "Water points",
  dam: "Dams",
  school: "Schools",
  church: "Churches and missions",
  police: "Police",
  shop: "Shops and mills"
};

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchKeyword(messageText) {
  const text = normalize(messageText);
  if (!text) return "help";
  for (const row of INTENT_MAP) {
    if (row.keywords.some((word) => text === word || text.startsWith(`${word} `) || text.includes(` ${word}`))) {
      return row.intent;
    }
  }
  return null;
}

function matchWardCommand(messageText) {
  const text = normalize(messageText);
  if (/^(14|ward 14|bvumba)$/.test(text)) return "mutasa-ward-14";
  if (/^(15|ward 15|sherukuru)$/.test(text)) return "mutasa-ward-15";
  return null;
}

function matchWardHint(messageText) {
  const text = normalize(messageText);
  if (/\b(14|bvumba|murowe|chikumbu|mukoyi|zambe)\b/.test(text)) return "mutasa-ward-14";
  if (/\b(15|sherukuru|hakuziwi)\b/.test(text)) return "mutasa-ward-15";
  return null;
}

function emptyWithNearby(intent, ward, types) {
  const otherWards = store.listWards().filter((item) => item.id !== ward.id);
  const nearby = otherWards.flatMap((other) =>
    store.listEntries({ types, wardId: other.id }).map((entry) => ({ entry, other }))
  );

  if (!nearby.length) {
    return `No ${INTENT_LABEL[intent] || intent} listed yet in ${ward.shortName}. Reply 14 or 15 to switch ward.`;
  }

  const lines = [
    `No ${INTENT_LABEL[intent] || intent} listed in ${ward.shortName} yet.`,
    `Nearest in this pilot:`
  ];
  for (const row of nearby) {
    lines.push("");
    lines.push(`${row.other.name}`);
    lines.push(require("./format").formatEntry(row.entry));
  }
  lines.push("");
  lines.push(`Reply ${nearby[0].other.number} to switch to that ward.`);
  return lines.join("\n");
}

function routeCommunityQuery(messageText, fromNumber, wardId) {
  const ward = store.getWard(wardId);
  const intent = matchKeyword(messageText);

  if (!intent) {
    const named = store.findEntry(messageText, ward.id) || store.findEntry(messageText);
    if (named && normalize(messageText).length >= 6) {
      store.logQuery({
        fromNumber,
        queryType: named.type,
        matchedEntryId: named.id,
        rawText: messageText,
        wardId: named.wardId
      });
      return {
        ok: true,
        intent: named.type,
        wardId: named.wardId,
        replyText: formatEntries([named], named.name),
        entries: [named]
      };
    }
  }

  if (!intent || intent === "help") {
    store.logQuery({
      fromNumber,
      queryType: "help",
      rawText: messageText,
      wardId: ward.id
    });
    return {
      ok: true,
      intent: "help",
      wardId: ward.id,
      replyText: buildMenuReply(ward),
      entries: []
    };
  }

  const types = intent === "list" ? undefined : INTENT_TYPES[intent];
  const entries = store.listEntries({
    types,
    wardId: ward.id
  });

  store.logQuery({
    fromNumber,
    queryType: intent,
    matchedEntryId: entries[0] ? entries[0].id : null,
    rawText: messageText,
    wardId: ward.id
  });

  const heading =
    intent === "list"
      ? `All services · ${ward.name} (${entries.length})`
      : `${INTENT_LABEL[intent]} in ${ward.name}`;

  return {
    ok: true,
    intent,
    wardId: ward.id,
    replyText: formatEntries(
      entries,
      heading,
      emptyWithNearby(intent, ward, types)
    ),
    entries
  };
}

module.exports = {
  routeCommunityQuery,
  matchKeyword,
  matchWardCommand,
  matchWardHint,
  normalize
};
