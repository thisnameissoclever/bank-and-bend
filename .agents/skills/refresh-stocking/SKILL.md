---
name: refresh-stocking
description: Refresh stocking history, confirmed deliveries and scheduled plants for existing Bank & Bend waters in Oregon and Washington.
---

Read AGENTS.md, docs/STOCKING.md and docs/UPDATE-PROTOCOL.md. Start with the latest stocking audit. Generate the full list of already cited stocking and event URLs with `python scripts/research-sources.py stocking --state WA` and again with OR. Add `--spot ID` for a single access. Read each distinct water's sources once.

| Start here | What it establishes |
|---|---|
| [WDFW Fish Plants data](https://data.wa.gov/resource/6fex-3r7d.json) | Completed releases. Use the saved waterbody and county queries, date filters and pagination. Includes smaller fish omitted by the catchable table. |
| [WDFW catchable reports](https://wdfw.wa.gov/fishing/reports/stocking/trout-plants/all) | Delivery date, count, hatchery and fish per pound. Reciprocal gives average pounds per fish. |
| [WDFW annual plan, 2026 edition](https://wdfw.wa.gov/sites/default/files/publications/02693/wdfw02693.pdf) | Planned allocations. Select the applicable year's plan; check agency announcements for changes. |
| [ODFW water-specific schedule](https://myodfw.com/fishing/species/trout/stocking-schedule) and [printable schedule](https://myodfw.com/fishing/species/trout/stocking-schedule-print) | Planned weeks, counts and size classes. |
| [ODFW regional recreation reports](https://myodfw.com/recreation-report) | Look for explicit completed stocking in the correct water and week. |
| [ODFW private hatcheries](https://www.dfw.state.or.us/fish/license_permits_apps/fish_propagation.asp) and saved operator/property URLs | Directory identifies operators. Only the operator or delivery evidence confirms a private plant. |

Inventory every existing stocked or planned water, including inactive, club-managed and river/canal entries. Sweep agency releases for matches to previously unlisted stocking at existing spots. Match county, waterbody, aliases and operator; two Turner Lakes are distinct. Group accesses only after matching the actual water.

Retain historical batches. Deduplicate by water, date/window, species, size class and hatchery where available. Record quantity, life stage, source IDs and date precision. Never invent a delivery day for a reported week. Past plans stay scheduled until confirmed. Small fish do not immediately improve dinner prospects. Apply shared facts to every matching access. Report distinct waters and accesses reviewed, new batches, and failed sources separately. Follow the protocol's tests, deployment and production readback.
