# Stocking view

The Stocking tab uses the same filtered locations as its map. Score circles retain the current overall fit; the attached green flag shows calendar days since the latest matching confirmed delivery. Plans show “Planned” and never acquire a delivery age without confirmation.

## Inclusion and filters

A stocked access has a nonzero confirmed delivery in the last 365 days or a current/upcoming schedule within the next year. Explicitly discontinued programs are excluded. This is a discovery window, not evidence fish remain or the stocking program will continue. Inactive access points retain their status and can be excluded with Open accesses only.

Catchable fish is the initial size filter. Agency labels including legals, catchable, jumbo, adult and broodstock qualify; fry, fingerlings, smolts and juveniles are separate. Unknown sizes remain selectable. “Catchable” describes the stocking record and does not establish legal retention. Size and species selections match OR within each group. Recency requires a confirmed delivery, so planned-only records disappear when a recency limit is applied.

Dates use Pacific calendar days. Same-day deliveries of different species or sizes remain separate. Multiple bank accesses at the same waterbody can display the same stocking record; quantities describe the waterbody delivery and must not be summed across access cards. Stocking history retains source links, checked dates, historical deliveries and plans.

## Persistence

Stocking recency, size/species selections and sort live in the authenticated preference JSON under `stocking`. Explore sorting stays independent. Existing general filters apply in both views. Signed-out use saves locally; shared links can carry both sets of filters. The selected tab stays device-local. No schema migration or new service is required.

## Verification

The model tests cover DST calendar arithmetic, invalid/future dates, plans versus delivery, OR filtering, multi-species deliveries, discontinued programs, recent sorting, shared links and preference validation. Browser QA covers score-plus-age flags, recency filtering, history navigation, scrolling and the narrow layout.
