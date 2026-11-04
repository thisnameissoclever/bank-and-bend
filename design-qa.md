# Stocking view QA

Date: 2026-11-03 Pacific
Implementation: https://bankandbend.com/#view=stocking
Verified code commit: 575bf533d0b09cd5d433bbb8b141f97ea531ae65
Production deployment: dpl_3Dc8x3x5txUyJtR5x7RknbcnFtE5, READY.

## Visual evidence

Source visual truth: `/workspace/scratch/396ac072801c/generated_images/exec-ef77c5b8-f033-413a-9aac-ade3c2be96c9.png`, 1488 x 1058 pixels.
Initial implementation: `/workspace/shared/stocking-first-desktop.jpg`, 1363 x 936 CSS pixels at 100% browser zoom.
Revised implementation: `/workspace/shared/stocking-final-desktop.jpg`, 1363 x 936; resized sidebar 430 CSS pixels, close to the source's proportional width.
Final overview: `/workspace/shared/stocking-live.jpg`, same viewport, original 370-pixel sidebar restored.
Narrow layout: `/workspace/shared/stocking-mobile.jpg`, 681 x 468 CSS pixels at 200% browser zoom. Also inspected 340 x 234 at 400% zoom. Browser screenshots were emitted at CSS dimensions; no density rescaling was needed. These are responsive breakpoint checks, not physical-device tests.

The source and revised desktop capture were viewed together in one comparison input. The source uses illustrative scores and three example locations. The implementation retains current scores, saved filters, actual availability and a larger corpus, so the displayed places and map extent differ. Focused inspection covered the sidebar cards, score circles, recency flags and phone navigation. Screenshots remain verification artifacts and are not committed as public account screenshots.

## Findings and comparison history

1. P2: The initial sidebar put results about 661 pixels below the page top. Clear filters occupied an entire extra row, repeated sharing text added height, and raw fish-size records wrapped unnecessarily. Fixed with an inline clear control, tighter spacing, a compact sharing link and readable size summaries with original text retained in the tooltip/history. Revised captures show results around 540 pixels at the narrower default sidebar, with all filters scrolling away as the list scrolls.
2. P2: At 340 CSS pixels, the account label extended beyond the phone header. Fixed by shortening it to Account or Sign in and narrowing the icon navigation. Rechecked header width matches the viewport within fractional-pixel rounding, with every navigation icon and account link visible.
3. No remaining actionable P0/P1/P2 findings. More schedule text than the mock is intentional because the current corpus includes separate future plans for the displayed waterbodies. User-controlled panel widths, current scores and filters are preserved.

## Required surfaces

- Typography: existing DM Sans and Manrope families retained; stocking age, quantity and score hierarchy is readable. Agency size strings are shortened without changing their meaning.
- Spacing: compact controls, responsive navigation, resizable sidebar, and the full sidebar scroll verified. Current data can produce taller cards than the illustrative mock.
- Colors: existing dark green tokens retained. Scores use the existing suitability scale; pale green flags remain distinct and legible. Planned deliveries use amber.
- Images/assets: live Google satellite imagery and the existing brand and Lucide icons retained. No mock imagery substitutes for the real map. Markers are interactive score circles with separate recency labels.
- Copy/content: real dated stocking records drive quantity, species, age and size. Confirmed and scheduled records remain separate. Missing counts are explicit. Singular result wording corrected.

## Interaction and regression checks

- A 14-day filter reduced both the list and map to the same matching access.
- Selecting catchable plus fry/fingerlings retained both selections and added the matching fry-stocked access. Restored the catchable-only default afterward.
- Stocking history opened dated records and source links; detail state survived refresh.
- A saved 14-day filter was read successfully from a separately signed-in deployment origin with separate local storage, confirming account persistence. Restored the original stocking window afterward.
- Narrow layout: collapsed/reopened panel, scrolled header off-screen and opened location details.
- Keyboard panel resizing worked; restored the original width afterward.
- Existing visits remained present. No journal, favorite, scoring or availability writes were performed.
- Console checked: only browser-extension metadata errors appeared; no application errors were observed.
- 115 automated tests passed, TypeScript passed, production build passed. New tests cover date arithmetic, plans, selection semantics, sorting, preferences and share links.

## Remaining test limits

Physical Android/iOS hardware was not available. The local preview route returned an upstream connection error, so rendered checks used the hosted production build. Leaflet fallback marker generation was typechecked, but the rendered map used Google Maps.

## Implementation checklist

- [x] Stocking navigation and filtered map
- [x] Scores in circles, stocking ages in green flags
- [x] Confirmed delivery cards and separate schedules
- [x] Shared filters, persisted preferences and independent Stocking sort
- [x] History, responsive panel and compact controls
- [x] Automated checks and hosted visual verification

final result: passed
