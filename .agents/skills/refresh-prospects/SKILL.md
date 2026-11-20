---
name: refresh-prospects
description: Reassess current-season keeper prospects and monthly profiles for every existing Bank & Bend fishing access.
---

Read docs/SCORING.md and docs/UPDATE-PROTOCOL.md. Enumerate every spot ID including null ratings and inactive locations. Check expiring overrides first. Use `python scripts/research-sources.py prospects --state OR` and WA for existing profile, override and stocking links. For a spot's wider evidence, use `all --spot ID` instead.

Start with [WDFW Southwest bank and boat creel reports](https://wdfw.wa.gov/fishing/reports/creel/southwest), [WDFW stocking](https://wdfw.wa.gov/fishing/reports/stocking/trout-plants), [WA emergency rules](https://wdfw.wa.gov/fishing/regulations/emergency-rules), [ODFW regional reports](https://myodfw.com/recreation-report), [ODFW rule updates](https://myodfw.com/articles/regulation-updates), and [ODFW stocking](https://myodfw.com/fishing/species/trout/stocking-schedule). Follow saved hatchery, fishway, dam count and local angler sources. Check warmwater species separately using agency species guidance, seasonal patterns and dated catches. A salmon survey cannot measure perch catches.

Group evidence by water, reach, species and date; apply judgments at the bank. Compare kept fish per surveyed bank angler with counts, dates and sample size. Separate releases, boats and jacks. Passage counts show fish movement; they cannot establish bites. Weigh legal retention, useful size, methods, historical seasonality and firsthand experience. Separate research confidence from suitability. Missing evidence can warrant null. Track access separately.

Use monthlyScores for typical seasonal patterns. A recent seasonalOverride needs score or explicit null, from, through, checkedAt, sourceIds and reason. Choose a short evidence-based window on Pacific dates. Let stale overrides expire. Preserve the old evidence; never roll an expiry forward without fresh support. Record reviewed-unchanged, changed and unresolved IDs so every location is accounted for. Publish and verify following the update protocol.
