const { store } = require("./store");

store.load();
if (process.argv.includes("--force")) {
  store.reset();
  console.log("Seeded Bvumba Ward 14 and Sherukuru Ward 15 (forced).");
} else {
  console.log("Store already exists. Pass --force to reset sample data.");
}
