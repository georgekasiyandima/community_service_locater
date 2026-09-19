# Architecture

The prototype is a modular monolith: one Node/Express process, with a dumb webhook and all product rules in services.

## Request path

1. A message arrives from WhatsApp (`POST /webhook/whatsapp`) or the demo UI (`POST /api/demo/message`).
2. `handleIncomingMessage` decides community vs admin (phone allowlist, or an explicit demo role).
3. `QueryService` or `AdminService` reads or writes the store.
4. A short text reply goes back. Twilio receives TwiML; the web demo receives JSON.

## Why the store is a JSON file

The original spec allowed Sanity or Postgres. For a one-ward pilot the file store is honest:

- No extra account to create before a Sunday demo
- The shape already matches `Ward`, `ServiceEntry`, `Admin`, `QueryLog`
- `src/store.js` is the seam. Replace it with Prisma/Postgres or Sanity when a second ward or the diocese CMS needs it

Do not put ward-specific if-statements in the router. Ward identity lives on the record.

## Admin identity

v1 authentication *is* the sender’s phone number, plus a PIN on the web console. That is correct for one or two trusted people. It is named technical debt. Replace it with a real login before a fifth admin or a second ward.

## Scale-up (do not build these now)

| Concern | Now | Later |
|---|---|---|
| Channel | Web demo + Twilio sandbox | WhatsApp Cloud API, then SMS/USSD behind the same router |
| Host | One Node process (Render/Railway) | Same service, more instances; handlers are stateless enough |
| Data | `data/store.json` | Postgres; Sanity for slow-changing school copy |
| Wards | Bvumba 14 + Sherukuru 15, sender session | Add a third ward with the same `Ward` table |
| Auth | Phone allowlist + PIN | Admin dashboard with login |
| Reliability | Process restart | Idempotent webhooks (Twilio retries), structured logs |
| Evidence | `QueryLog` | A simple weekly count per ward for funders |

## API

| Method | Path | Use |
|---|---|---|
| GET | `/api/health` | Uptime |
| GET | `/api/ward` | Pilot ward |
| GET | `/api/services` | Directory |
| GET | `/api/metrics` | Case-study numbers |
| POST | `/api/demo/message` | Web chat |
| POST | `/api/admin/update` | Console update |
| POST | `/webhook/whatsapp` | Twilio |

## Local Twilio test

Use ngrok or deploy first, then paste the public `/webhook/whatsapp` URL into the sandbox. The web demo does not need this step.
