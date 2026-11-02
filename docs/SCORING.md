# Scoring definitions and settings

Scores describe the specified bank or shore access under ordinary conditions. A rating is a judgment supported by attached evidence and must be reconsidered when the evidence or location changes. Use null when there is no useful basis for a judgment. Missing recent catch reports alone do not establish poor fishing.

## Independent importance settings

The owner can set each factor from 0 to 100. These are independent importance values. Two factors at 80 have equal influence. For each location, multiply each available score by its importance, add the results, and divide by the sum of those available factors’ importances. A missing score contributes to neither sum. All-zero settings are rejected; if no weighted factor has a rating, overall fit is unknown. Changes immediately update the map, list, ranking, score filters and details. Shared server settings persist across browsers and apply to public corpus exports and research tools. Only the configured, signed-in owner can edit them. Saves use revision checks; a conflicting browser must load the current settings before editing again. Other open pages refresh on focus and every 30 seconds. Personal filters, journals and ratings remain separate.

## Starting baseline

| Factor | Importance |
| --- | ---: |
| Privacy & space | 12 |
| Usable bank | 16 |
| Casting quality | 3 |
| Ease of access | 7 |
| Manageable water | 10 |
| Scenery | 7 |
| Current-season prospects | 20 |
| Research confidence | 0 |

Travel time has no score. It remains visible and available for filtering and sorting. Restoring the starting baseline uses this table; later research releases preserve saved owner choices.

## Definitions and anchors

### Privacy & space

How likely you are to fish without being seen by other people, with room to spread out as a secondary consideration. Judge screening and sightlines from paths, lawns, roads, buildings, opposite banks, boats and other fishing positions, together with how often people use them. An open bank can have plenty of space and little privacy.

1-2: exposed shared positions with frequent observers. 3-4: readily visible from public activity or routes. 5-6: partial screening, intermittent passersby, or an uncrowded exposed bank. 7-8: screened or recessed positions with few likely observers and workable separation. 9-10: strong screening or remoteness with very few likely sightlines. High ratings require a useful basis for low visual exposure. Trees behind the angler do not establish screening from a path beside the water. Consider leaf loss, elevated paths, open lawns and changing water levels where they affect the view. A quiet visit supports low observed use during that visit; it does not prove the bank is hidden. Use null when neither the layout nor visitor-use evidence supports a practical judgment.

### Usable bank

The amount of legally reachable shoreline with usable places to stand and fish. Count distinct bank openings and continuous usable stretches, with vegetation, barriers and seasonal water levels reducing the available area.

1-3: one very small usable position. 4-6: a short stretch or a few openings. 7-8: several substantial areas. 9-10: extensive continuous usable shoreline.

### Casting quality

How comfortably the selected position lets you stand, cast, retrieve and land a fish. Consider footing, room behind the cast, overhead branches, shoreline obstructions and the height of the bank or dock above the water.

1-3: awkward footing or severe casting obstructions. 4-6: usable with care or restricted casts. 7-8: comfortable with minor obstacles. 9-10: stable, clear casting and landing space.

### Ease of access

The physical effort and complexity of getting from legal parking to the fishing position. Consider walking distance, slope, surface, route clarity, steps, gates and obstacles along the approach.

1-3: difficult terrain or a complicated approach. 4-6: a noticeable walk, slope or rough section. 7-8: a straightforward short approach. 9-10: very short, clear and easy access.

### Manageable water

How easily a beginner can keep bait, a bobber, a spinner or a conventional lure in a useful fishing area from this position. Judge ordinary current, turbulence, wind exposure and waves at the castable bank water; gentle water that permits simple presentations scores highly.

1-3: flow or waves regularly defeat a simple presentation. 4-6: control requires frequent adjustment or a narrow sheltered pocket. 7-8: ordinary gear controls the presentation with modest adjustment. 9-10: calm or gently moving water makes control straightforward.

### Scenery

The visual appeal of the setting from the fishing position. Consider the water, trees, terrain, views and visible development.

1-3: heavily industrial or visually unpleasant. 4-6: ordinary developed surroundings. 7-8: attractive natural setting. 9-10: exceptional scenery.

### Current-season prospects

The chance of catching an accepted fish worth keeping for dinner from this bank now. Consider useful fish size, legal retention, bank reach, stocking, reported catches and seasonal timing together. Monthly estimates change by Pacific date, and recent evidence can adjust them until its stated expiry.

1-3: closed target season or very weak present opportunity. 4-6: marginal to reasonable timing. 7-8: favorable season. 9-10: a particularly strong current window supported by the fishery and timing.

### Research confidence

How well the access details and fishing assessment are supported by relevant sources and observations. Consider source quality, dates, directness, agreement and unresolved questions that affect a trip decision.

1-3: major claims lack a useful basis. 4-6: several important facts are supported with material gaps. 7-8: most practical claims have good support. 9-10: strong, relevant and current evidence covers the important claims.

## Factor boundaries

Privacy & space primarily measures the likelihood of being seen at the fishing position. Physical separation remains secondary. Road traffic affects privacy only when people on the road have a plausible view of the angler. Usable bank measures the amount of fishable shoreline. Ease of access covers the approach from legal parking; casting quality covers the position after arrival. Legal access is a separate requirement. Manageable water concerns control of a fishing presentation. Gentle bank water can score 9 or 10 even beside a faster river channel. A general swimming warning does not establish difficult lure or float control. Explain actual currents, waves, turbulence and exposure at the supported bank. Preserve dated firsthand observations and distinguish them from layout-based inference. Current-season prospects is the only fishing-prospects score. It combines the opportunity for an accepted dinner-size fish with the current month and recent conditions. Research confidence describes support for the assessment and starts at zero importance.

## Overall fit and hard limits

Round overall badges and filter thresholds to one decimal place; sort using the unrounded capped score. A 7 means a good fit, 8 excellent with ordinary trade-offs, 9 outstanding and 10 exceptional. These anchors do not force a score distribution. Physical-separation or water-manageability ratings of 1-2 cap overall fit at 4; a rating of 3 caps fit at 5; a rating of 4 caps fit at 6. These caps preserve the established physical-space and manageable-water requirements even when their importance is set to zero. For privacy-reviewed records, the earlier physical-separation judgment is retained separately in privacyReview.physicalSpaceScore with its rationale. The new privacy rating affects the weighted score and filters; it has no separate hard cap. Reconsider that retained physical judgment when new room or crowding evidence becomes available. Show the applicable cap in score details. Casting quality has no separate cap. Availability, fishing regulations, retention and consumption advisories remain explicit trip conditions.

## Seasonal changes

`lib/seasonality.ts` selects the current Pacific month from twelve monthly judgments. A dated recent-evidence override applies only within its stated interval, then expires back to the calendar. The interface recalculates at date changes and on returning to the tab. Scheduled stocking remains labeled scheduled. A seasonal score never reopens an inactive access point.

## Maintenance

`lib/score-definitions.ts` supplies the descriptions in settings, score details, the research panel and structured corpus. Keep this document consistent with it. Do not reuse a rating or its explanation as independent evidence. Record changed reasoning, source checks and unresolved questions in each location’s research log.

## October 31 score removal

an angler removed separate keeper potential and quiet setting. Their sliders, thresholds and contribution to fit are retired. Remaining custom importance values are preserved, including the current-season importance. Old keeper sorts map to current-season prospects; quiet-setting sorts map to overall. Retired thresholds are removed without adding new restrictions. Historical score judgments are archived in docs/research/2026-10-31-retired-scores.json. Useful general fishery reasoning remains as unscored fishingBackground. Existing seasonal profiles already assess current keeper opportunity and remain unchanged; this model change does not refresh fishing evidence.

## November 1 score removal

Species fit is retired. Species remain selectable filters and location attributes. Current scores, reasons, settings, calculations, sort choices and score thresholds exclude this factor. Old saved weights, thresholds, sort choices and shared links are migrated on read or write; remaining custom importance values are preserved. Historical judgments are archived in docs/research/2026-11-01-retired-species-fit.json. The compatibility parser accepts the old key only to discard it.
