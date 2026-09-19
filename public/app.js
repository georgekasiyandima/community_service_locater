const thread = document.getElementById("thread");
const composer = document.getElementById("composer");
const input = document.getElementById("message");
const directoryBody = document.getElementById("directory-body");
const phoneWard = document.getElementById("phone-ward");

const WARD_LABEL = {
  "mutasa-ward-14": "Bvumba 14",
  "mutasa-ward-15": "Sherukuru 15"
};

let role = "community";
let wardId = "mutasa-ward-14";
let filter = "all";
let wardFilter = "all";
let entries = [];

function addBubble(text, who) {
  const div = document.createElement("div");
  div.className = `bubble ${who}`;
  div.textContent = text;
  thread.appendChild(div);
  thread.scrollTop = thread.scrollHeight;
}

function formatWhen(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function setWard(nextWardId, announce) {
  wardId = nextWardId;
  phoneWard.textContent = `WhatsApp · ${WARD_LABEL[wardId]}`;
  document.getElementById("ward-14").classList.toggle("active", wardId === "mutasa-ward-14");
  document.getElementById("ward-15").classList.toggle("active", wardId === "mutasa-ward-15");
  if (announce) {
    sendMessage(wardId === "mutasa-ward-14" ? "14" : "15");
  }
}

async function sendMessage(text) {
  const body = String(text || "").trim();
  if (!body) return;
  addBubble(body, "me");
  input.value = "";

  const response = await fetch("/api/demo/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body, role, wardId })
  });
  const data = await response.json();
  if (data.wardId) {
    wardId = data.wardId;
    phoneWard.textContent = `WhatsApp · ${WARD_LABEL[wardId] || data.wardId}`;
    document.getElementById("ward-14").classList.toggle("active", wardId === "mutasa-ward-14");
    document.getElementById("ward-15").classList.toggle("active", wardId === "mutasa-ward-15");
  }
  addBubble(data.replyText || "No reply.", "bot");
  await loadMetrics();
  await loadDirectory();
}

async function loadMetrics() {
  const response = await fetch("/api/metrics");
  const data = await response.json();
  document.getElementById("stat-entries").textContent = data.totals.entries;
  document.getElementById("stat-attention").textContent = data.totals.needingAttention;
  document.getElementById("stat-queries").textContent = data.totals.queries;
}

function renderDirectory() {
  const rows = entries.filter((entry) => {
    const typeOk = filter === "all" || entry.type === filter;
    const wardOk = wardFilter === "all" || entry.wardId === wardFilter;
    return typeOk && wardOk;
  });
  directoryBody.innerHTML = rows
    .map(
      (entry) => `
      <tr>
        <td><code>${entry.code}</code></td>
        <td>${WARD_LABEL[entry.wardId] || entry.wardId}</td>
        <td><strong>${entry.name}</strong><br /><span style="color:#6d6256">${entry.extraInfo}</span></td>
        <td><span class="badge ${entry.status}">${entry.status}</span></td>
        <td>${entry.locationNote}<br />${entry.contact || ""}</td>
        <td>${formatWhen(entry.statusUpdatedAt)}</td>
      </tr>`
    )
    .join("");
}

async function loadDirectory() {
  const response = await fetch("/api/services");
  const data = await response.json();
  entries = data.entries || [];
  renderDirectory();
}

document.getElementById("role-community").addEventListener("click", (event) => {
  role = "community";
  event.currentTarget.classList.add("active");
  document.getElementById("role-admin").classList.remove("active");
});

document.getElementById("role-admin").addEventListener("click", (event) => {
  role = "admin";
  event.currentTarget.classList.add("active");
  document.getElementById("role-community").classList.remove("active");
});

document.getElementById("ward-14").addEventListener("click", () => setWard("mutasa-ward-14", true));
document.getElementById("ward-15").addEventListener("click", () => setWard("mutasa-ward-15", true));

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

document.querySelectorAll("[data-send]").forEach((button) => {
  button.addEventListener("click", () => sendMessage(button.dataset.send));
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.toggle("secondary", item !== button);
    });
    renderDirectory();
  });
});

document.querySelectorAll("[data-ward]").forEach((button) => {
  button.addEventListener("click", () => {
    wardFilter = button.dataset.ward;
    document.querySelectorAll("[data-ward]").forEach((item) => {
      item.classList.toggle("secondary", item !== button);
    });
    renderDirectory();
  });
});

addBubble(
  "Welcome to Mutasa Central.\nReply 14 for Bvumba or 15 for Sherukuru.\nThen CLINIC, BOREHOLE, SCHOOL, CHURCH, POLICE or SHOP.\nAdmins: UPDATE BOREHOLE2 WORKING",
  "bot"
);

loadMetrics();
loadDirectory();
