# Fishing access inventory

## Contents

- [Geographic scope](#geographic-scope)
- [How to find omissions](#how-to-find-omissions)
- [How to decide inclusion](#how-to-decide-inclusion)
- [Evidence and maintenance](#evidence-and-maintenance)

## Geographic scope

The inventory covers Washington and Oregon fishing access around northwest Vancouver. Review every named candidate that can plausibly be reached within 90 minutes, then retain useful candidates out to the application's 120-minute limit. A road route without traffic is a screening estimate. The displayed planning range includes ordinary approach time; congestion, weather and road closures can extend it. Use the fishing position and its lawful parking route as the unit of comparison. Separate accesses on one lake or river can differ substantially in available bank, crowding, current and walking distance. Merge aliases for the same access. Keep the existing spot ID when correcting its name or research.

## How to find omissions

Compare the current map against these inventories in every travel direction:

- Washington Department of Fish and Wildlife lake, river, hatchery and water-access lists, including the agency's geographic access dataset.
- Oregon Department of Fish and Wildlife fishing-location lists and the Marine Board's geographic boating-access dataset.
- County and municipal park inventories, port recreation properties, state parks, federal recreation sites, and utility-managed reservoir parks.
- Public water trails, designated fishing easements, and legitimate paid fishing or day-use properties. Review boat launches even when an agency describes only boating facilities. Check nearby shore openings and any lawful fishing from the launch itself. Record whether casting interferes with launching, retrieval or tied boats. A public ramp's presence supports an access lead; its manager's rules and visible shoreline determine the usable fishing position. After the first pass, compare all unmatched names and nearby coordinates against the researched records. Check alternate names and both sides of river crossings. Run a second search for each geographic gap. Record a decision for every plausible candidate instead of silently dropping an unfamiliar or lower-rated place.

## How to decide inclusion

Apply the parking, route and standing-position requirements in `docs/ACCESS.md`. Include a supported land-fishing opportunity for trout, smallmouth bass, salmon, crappie or perch. Apply honest scores to access, fish prospects, physical room and water control. Missing recent catch reports alone do not make an established fishery unsuitable. A useful inference can support a rating; store null when no reasonable basis remains. Retain useful seasonal locations and temporarily closed locations with an inactive status and a specific reason. Exclude locations that require unauthorized entry, have no suitable retained target, require a boat for the supported fishing position, or fall outside the maintained travel range. Preserve a specific unresolved access question after pursuing available manager information, maps and alternate sources. An unresolved question does not establish a legal closure. A material unresolved parking, route or usable-bank question keeps the candidate inactive with coordinate navigation disabled until the access review supports it. Judge privacy primarily by the likelihood of being seen at the fishing position, considering screening, observer sightlines and ordinary visitor use. Physical separation is secondary. Keep noise in quiet setting. Describe current at the supported bank rather than labeling an entire river. Treat each previous rating explanation as a judgment to reconsider.

## Evidence and maintenance

`data/coverage-audit.json` records the latest candidate decisions and source inventories. Each mapped location retains its own evidence and scores in `data/spots.json`. Dated reports under `docs/research` preserve the inspected source revisions, route estimates and visual findings. On each expansion, read the previous inventory and recheck its exclusions or unresolved questions against current information. Add at least one useful new source class when available. Preserve saved scoring importance, filters, favorites, visits, ratings and comments. Research updates must not reseed personal records.
