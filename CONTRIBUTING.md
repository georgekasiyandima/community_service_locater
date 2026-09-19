# Contributing to the Community Service Locator

Ubuntu Code treats this repository as a product, not a homework folder.

## Before you change behaviour

- Keep v1 in these two Mutasa Central wards, keyword-only, no payments, no user accounts.
- Put new product rules in `src/services/`, not in the Express routes.
- If you add a clinic, borehole or school, mark whether it is **sample** or **field-verified**.
- Do not commit `.env` or `data/store.json`.

## Everyday workflow

1. Create a branch from `main`.
2. Run `npm start` and click through the public demo and `/admin`.
3. If you change reply text, send `HELP`, `CLINIC`, `BOREHOLE`, `SCHOOL`, `LIST` and one `UPDATE`.
4. Write commit messages that say why, in the same tone as the existing history.

## What “done” means for a change

A priest or councillor could use the new behaviour without a developer sitting next to them.
