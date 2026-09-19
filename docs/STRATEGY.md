# Ubuntu Code — Strategy for the first product

This is the principal-engineer recommendation. Short version: **do not shop for a different problem. Put this locator in front of real people in one ward, then use that evidence to sell the rest of Ubuntu Code.**

---

## 1. Is this the right prototype?

Yes. Keep it. The other rural problems are real, and they are the wrong first proof.

| Problem you could have picked | Why it is tempting | Why it is a worse first prototype |
|---|---|---|
| WhatsApp storefront / booking for SMEs | Matches the one-pager’s paid work | Needs sales, stock photos, and a paying shop before you have a story |
| Mukando / savings-group records | High need | You would be touching money and trust on day one |
| Market prices / buyer–seller | Agritech is fundable | Data collection is harder than clinic status; stale prices destroy trust |
| School fees / diocese portal | Path to Fr Kembo | Political, multi-school, and too large for a 3–4 week proof |
| **Clinic / borehole / school locator** | **Matches WhatsApp-first civic tools** | **No money movement. Knowledge already exists. One admin can keep it true.** |

The locator is not Ubuntu Code’s whole business. It is the **wedge**: a small, true product that proves you understand rural conditions and can ship.

That is what a church, a council, a school or Caritas actually needs to see before they ask you to rebuild their website or directory.

---

## 2. What we changed from the original spec

The written spec is sound. Three decisions were tightened so the prototype can be shown to a non-technical person this week.

1. **Do not make Twilio the only demo.**  
   A sandbox forces every visitor to send a join code. That kills a parish meeting. The same router now serves a public web chat *and* `/webhook/whatsapp`. Twilio remains the real-world channel; the web page is the showcase.

2. **Do not start on Sanity.**  
   Sanity is right later, when this folds into the Diocese of Mutare content model. For a pilot, a file-backed store behind a repository (`src/store.js`) is enough. Swapping to Postgres or Sanity is a store change, not a product rewrite.

3. **Label the data as sample until it is verified.**  
   Showing “Sherukuru Clinic: CLOSED” as if it were live is how you lose a nurse and a councillor. The banner on the site is not decoration. It is the integrity rule for outreach.

Everything else in the spec stays: these two neighbouring wards, keywords not AI, phone-number admin allowlist, no payments, no accounts.

---

## 3. How this maps to the one-pager

The one-pager sells Ubuntu Code as a studio. This repo is the first **product artefact** of that studio.

| One-pager line | What this prototype demonstrates |
|---|---|
| Tools for intermittent connectivity, WhatsApp-first | Keyword replies, short messages, no app install |
| Civic and council information platforms | Ward directory with status |
| School and NGO communication tools | School open/closed + term notes |
| Listen → Build → Support | Free consult, then a tool a non-technical admin can run |
| Caritas Mutare as proof of work | This is the *next* proof: you do not only make websites |

Use them together. The PDF opens the door. The live demo closes it.

---

## 4. Should BloomTech appear?

Yes — as one supporting line. Not on the headline.

For a priest in Mutare, a head teacher in Bvumba or Sherukuru, or Caritas, **Caritas Mutare is the credential**. A US bootcamp name does not travel in that room.

For a funder, a Harare NGO, or a partner who wants to know you were trained, BloomTech is useful.

Place it here, and only here:

> George Kasiyandima — Founder, Ubuntu Code. Full-stack developer from Manicaland. Built the live Caritas Mutare site. Full-stack training, BloomTech.

Do not add a logo wall. Do not lead with “BloomTech graduate.” Do not put it above Caritas.

---

## 5. How to scope the next 90 days

Think in three layers. Do not mix them.

### Layer A — This prototype (weeks 1–4)

Ship what is in this repo. Then replace sample rows with 10–15 real, named entries from one ward.

**Done looks like:** the success criteria already in the spec (real admin update, five real queries, a 60-second film).

### Layer B — The case study (weeks 4–6)

Write one page: the ward, the gap, the tool, the numbers, a quote from the councillor or parish rep. This becomes slide two of every outreach conversation.

### Layer C — Paid Ubuntu Code work (from week 3, in parallel)

The locator is not what you invoice a hardware shop for. When you sit with an SME, you sell a website, a WhatsApp catalogue, or record-keeping — using this locator *and* Caritas as proof that you finish things.

Do not promise a diocese-wide platform in the first meeting. Promise a ward test, then a conversation about their actual list.

---

## 6. Who to approach, in what order

Warmth beats volume. Manicaland is a relationship market.

1. **Caritas Mutare / people who already know the Caritas site.**  
   Ask for 30 minutes and a ward introduction. You are not cold. You are showing the next useful thing.

2. **Fr Kembo / Education Department.**  
   Take the school slice only: “A head teacher can mark a school closed for a break; parents can ask.” Do not open with boreholes in that room unless they ask.

3. **One parish priest in Mutasa or Mutare rural.**  
   You need one admin who is already trusted. A parish rep is the cheapest, most credible updater you will find.

4. **Ward councillor or clinic clerk — after the priest, not before.**  
   Civic buy-in matters. It is easier once a church or school is already using it.

5. **Head teachers** for the school list, once two entries are real.

6. **SMEs and emerging businesses in Mutare, Rusape, Chipinge, Nyanga.**  
   Separate offer. Same founder story. Bring the one-pager, not a borehole demo, unless they are a civic partner.

Never send a 12-page architecture document to a non-technical person. Send the one-pager, a link to the live demo, and a time to sit together.

---

## 7. Risks that will actually kill the pilot

- **Stale data.** One wrong “OPEN” and people stop trusting you. Better to say “unverified” than to guess.
- **Admin drop-off.** If the only updater is you in South Africa, this is a demo, not a product. The first hire is a local champion, not a second developer.
- **Scope creep.** Multi-language, payments, and “AI chat” will delay the thing you need: a true list for one ward.
- **Over-claiming.** Do not tell a council this is already a district system.

---

## 8. What “best software startup in Manicaland” means in year one

It does not mean a logo and a pitch deck. It means:

- one public proof (Caritas)
- one working product people can touch (this locator)
- a clean repository and written way of working (this repo)
- five conversations that turn into two paid builds
- a habit of documenting what you shipped

That is how a studio becomes trusted. The rest of the one-pager’s service list is the menu once they already believe you.
