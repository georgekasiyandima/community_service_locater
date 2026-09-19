const lock = document.getElementById("lock");
const app = document.getElementById("app");
const pinForm = document.getElementById("pin-form");
const pinError = document.getElementById("pin-error");
const adminTable = document.getElementById("admin-table");
const recent = document.getElementById("recent");

let pin = sessionStorage.getItem("ubuntu-admin-pin") || "";

const WARD_LABEL = {
  "mutasa-ward-14": "Bvumba 14",
  "mutasa-ward-15": "Sherukuru 15"
};

function nextStatus(entry) {
  if (entry.type === "borehole" || entry.type === "water") {
    return entry.status === "working" ? "broken" : "working";
  }
  return entry.status === "open" ? "closed" : "open";
}

async function verifyPin(value) {
  const response = await fetch("/api/admin/verify-pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: value })
  });
  return response.ok;
}

async function load() {
  const [servicesRes, metricsRes] = await Promise.all([
    fetch("/api/services"),
    fetch("/api/metrics")
  ]);
  const services = await servicesRes.json();
  const metrics = await metricsRes.json();

  adminTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Code</th>
          <th>Ward</th>
          <th>Name</th>
          <th>Now</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${(services.entries || [])
          .map((entry) => {
            const next = nextStatus(entry);
            return `
              <tr>
                <td><code>${entry.code}</code></td>
                <td>${WARD_LABEL[entry.wardId] || ""}</td>
                <td>${entry.name}<br /><span style="color:#6d6256">${entry.locationNote}</span></td>
                <td><span class="badge ${entry.status}">${entry.status}</span></td>
                <td><button class="btn small" data-code="${entry.code}" data-status="${next}">Mark ${next}</button></td>
              </tr>`;
          })
          .join("")}
      </tbody>
    </table>
  `;

  recent.innerHTML = (metrics.recentQueries || [])
    .map(
      (item) =>
        `<p><strong>${item.queryType}</strong> · ${new Date(item.timestamp).toLocaleString()} · ${item.fromHash}</p>`
    )
    .join("") || "<p>No queries yet. Use the public demo first.</p>";

  adminTable.querySelectorAll("button[data-code]").forEach((button) => {
    button.addEventListener("click", async () => {
      const response = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: button.dataset.code,
          status: button.dataset.status,
          pin
        })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || data.replyText || "Update failed");
        return;
      }
      await load();
    });
  });
}

async function unlock(value) {
  const ok = await verifyPin(value);
  if (!ok) {
    pinError.textContent = "That PIN is not right.";
    return;
  }
  pin = value;
  sessionStorage.setItem("ubuntu-admin-pin", pin);
  lock.classList.add("hidden");
  app.classList.remove("hidden");
  await load();
}

pinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  unlock(document.getElementById("pin").value);
});

if (pin) {
  unlock(pin);
}
