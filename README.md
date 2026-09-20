# Ubuntu Code — Community Service Locator

**A WhatsApp-first locator for clinics, boreholes, schools and community places in Bvumba Ward 14 and Sherukuru Ward 15, Mutasa Central.**

This repository is the working prototype behind [Ubuntu Code](docs/ONE_PAGER.md): a community-rooted software studio building practical digital tools for churches, schools, councils and small businesses in rural and small-town Zimbabwe.

**Live demo:** [https://ubuntu-code-locator.onrender.com](https://ubuntu-code-locator.onrender.com)

---

## Why this exists

Residents of a ward already know which clinic is open and which borehole works. That knowledge is scattered across word of mouth. There is no shared place to ask, and no simple way to flag a change.

This prototype proves one thing a priest, head teacher, councillor or NGO coordinator can see with their own thumbs:

1. A community member texts `CLINIC`, `BOREHOLE` or `SCHOOL` and gets a current answer.
2. A trusted local admin texts `UPDATE BOREHOLE2 WORKING` and the next person sees it.

It is deliberately two neighbouring wards, one channel, no payments, no accounts.

---

## See it in 60 seconds

1. Open the [live demo](https://ubuntu-code-locator.onrender.com).
2. Stay on **Bvumba 14** and tap **CLINIC**. You should see Sherukuru Clinic offered as the nearest clinic.
3. Switch to **Sherukuru 15** and tap **CLINIC** again.
4. Switch the chat to **Local admin**.
5. Tap **Fix Mukoyi borehole** or send `UPDATE BOREHOLE2 WORKING`.
6. Switch back to **Community member**, choose **Bvumba 14**, tap **BOREHOLE**.

## Quick start

```bash
git clone https://github.com/georgekasiyandima/community_service_locater.git
cd community_service_locater
cp .env.example .env
npm install
npm start
```

Live: [https://ubuntu-code-locator.onrender.com](https://ubuntu-code-locator.onrender.com) · admin: [https://ubuntu-code-locator.onrender.com/admin](https://ubuntu-code-locator.onrender.com/admin)

Locally, open [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin](http://localhost:3000/admin) (PIN `2468`)

| Command        | What it does                                      |
|----------------|---------------------------------------------------|
| `npm start`    | Run the service                                   |
| `npm run dev`  | Restart on file changes                           |
| `npm run seed` | Reset the Bvumba 14 + Sherukuru 15 dataset        |

---

## What is in scope (v1)

- Keyword / menu replies: `HELP`, `14`, `15`, `CLINIC`, `BOREHOLE`, `SCHOOL`, `CHURCH`, `POLICE`, `SHOP`, `DAM`
- Admin commands: `LIST`, `UPDATE <code> <status>`
- Two wards: Bvumba Ward 14 and Sherukuru Ward 15, Mutasa Central — names are local, statuses until field-verified
- Phone-number allowlist for 1–2 admins
- Query log with hashed numbers (for the case-study metrics)
- Same logic on a web demo and a Twilio WhatsApp webhook

**Out of scope on purpose:** multi-ward, multi-language, user accounts, payments, NLP, official WhatsApp Business verification.

---

## Architecture

```
WhatsApp (Twilio) ──┐
                    ├── POST /webhook/whatsapp or /api/demo/message
Web demo chat ──────┘                 │
                                      ▼
                              Message router
                         ┌────────────┴────────────┐
                         ▼                         ▼
                   Query service             Admin service
                         └────────────┬────────────┘
                                      ▼
                              Content store (JSON)
```

The webhook stays dumb: parse, route, reply. Business rules live in services so the channel can change later (official WhatsApp Cloud API, SMS, USSD) without rewriting the product.

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the scale-up path.

## Environment

See [.env.example](.env.example). The important ones:

| Variable           | Purpose                                      |
|--------------------|----------------------------------------------|
| `DEFAULT_WARD_ID`  | Pilot ward key                               |
| `ADMIN_PHONES`     | E.164 numbers allowed to send UPDATE         |
| `ADMIN_PIN`        | Web console PIN                              |
| `LOG_SALT`         | Salt for hashed query-log numbers            |

---

## Project status

Prototype / field-ready demo. Sample data is labelled as such. Do not present borehole or clinic statuses as live until a local admin has verified them.

Success for the first real week:

- Verified entries for Bvumba 14 and Sherukuru 15
- At least one unprompted admin update
- At least five real community queries answered correctly
- A 30–60 second recording for outreach

---

## Ubuntu Code

Ubuntu Code is a software initiative founded by George Kasiyandima, a full-stack developer from Manicaland, with fellow developers. We build affordable tools for the institutions and businesses that serve rural and small-town Zimbabwe.

- One-pager copy: [docs/ONE_PAGER.md](docs/ONE_PAGER.md)
  

**Contact:** kasiyageorge86@duck.com · +27 66 084 5934 (WhatsApp)

---

## License

MIT. See [LICENSE](LICENSE).
