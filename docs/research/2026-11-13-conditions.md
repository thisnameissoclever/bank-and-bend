# November 13 conditions update

Production contains 361 spots. The current availability snapshot is revision 305. There are 341 inactive or due entries. This run completed nine focused access reviews, not a full route audit of all 341 entries. Other entries retain their prior check dates. The source inventory and remaining scope are in `data/research-refresh-2026-11-13.json`.

## Changes

- Deep Lake, Millersylvania: WDFW confirms 550 rainbow trout delivered November 10 at 0.73 fish per pound, approximately 1.37 pounds each. Both the public Fish Plants dataset and hatchery-filtered catchable table agree. Current-season prospects are 8/10 from November 13 through November 19. This temporary judgment combines recent delivery and useful eating size; no catch rate or remaining-fish quantity is claimed. The current winter schedule lists day use open. A fresh inspection of the existing aerial view shows the parking row connecting south to the hand-launch apron and fishing dock, west of the swimming enclosure. Image capture date is unavailable. The boardwalk closure near campsite 31 is separate.
- Riffe: added both November 9 steelhead deliveries to both lake entries: 11,960 fingerlings at 26 fish/pound and 28,900 yearlings at 17 fish/pound. They average about 0.038 and 0.059 pound each. These are confirmed deliveries of small fish, so they do not raise immediate keeper prospects. Historical events are preserved. The Mossyrock access pause remains separate.
- Lacamas: the direct state table lists November 9 boat-ramp microcystin at 0.700 micrograms/L, below the recreational guideline. November 2 results are microcystin 7.900 and anatoxin-a below detection. Updated both lake access records. The web reader returned an older October version; direct public retrieval supplied the newer records. These samples do not clear drawdown footing, trail construction or cove restrictions.
- Battle Ground and Klineline: retried underlying regional and E. coli layers successfully. Both explicitly report no advisory; September 25 is still the posting date and routine monitoring resumes May 2027. No fresh sample claimed.
- Horsethief: September 22 remains the latest published sample. County information provides no formal lifting decision. The lake fishery remains seasonally closed.
- Wallace: the direct lake-specific table still ends July 20, 2010. County park and health notices provide no current named advisory. Missing recent testing is not an active advisory.

## Access decisions

Saved nine revision-specific proposals for Deep Lake, Horsethief, Oxbow, Speelyai, Gales Creek, Danger Park, West Bridge and the two Lacamas entries. No proposal changes active state. Original future closure dates remain intact. Oxbow's full-park closure still blocks its route; Speelyai's full-park closure still blocks its parking and shoreline; Gales Creek's campground, trailhead and day use remain closed for forest operations; Danger Park remains restricted through winter 2027. West Bridge's old work window has expired, but the current project page does not establish reopening of the continuous route.

The Estuary Partnership's updated project page and newly considered November restoration imagery emphasize changed channels and woody debris. Completed construction does not resolve County Yard parking or reopen Danger Park. The Millersylvania winter schedule was an additional useful source distinguishing seasonal campground services from open day use.

## Seasonal review and limits

The retrieved WDFW creel index still lists November 2 as the latest report. ODFW regulation updates remain dated November 3; its Willamette report still carries the November 2 stocking table. A past scheduled week does not establish delivery. Older seasonal overrides were not extended. Monthly profiles continue automatically; no missing report was converted into a poor-fishing score. Newly retrieved Blackmans Lake records were explicitly excluded from Black Lake, Thurston County.

The initial source pass attempted 512 URLs, with 321 HTTP 200 responses and 191 failures. Successful retrieval is not completed claim verification. Priority retries recovered both Clark monitoring layers, Wallace and Horsethief toxin tables and the linked county pages. Oxbow's direct 403 was supplemented by the current official page through web retrieval. The Camas drawdown page returned 503, and web retrieval also failed. Specific failures are retained in the audit JSON. The remaining access reviews and fresh visual checks are incomplete; this update does not certify every map entry's present route.

## Publication and shared-write scope

Public research changes are limited to nine spots, their source links and research notes. Shared availability writes were not possible: the public endpoint reports `canEdit=false`, and the Browser connector requires an originating connected browser context unavailable in this run. `data/availability-proposals-2026-11-13.json` is unapplied. Re-read production revisions and current evidence before applying it through an authorized owner connection. No legacy connector writes, corpus availability substitutions, journal edits, filter changes, custom-weight changes, audience changes or schedule changes were made.

## Sources

- [WDFW catchable trout, Eells Springs](https://wdfw.wa.gov/fishing/reports/stocking/trout-plants?hatchery=EELLS+SPRINGS)
- [WDFW Fish Plants](https://data.wa.gov/resource/6fex-3r7d.json), exact waterbody queries retained per spot
- [Millersylvania winter schedule](https://parks.wa.gov/find-activities/winter-schedule)
- [Lacamas toxin table](https://www.nwtoxicalgae.org/Data.aspx?SiteID=94)
- [Horsethief toxin table](https://www.nwtoxicalgae.org/Data.aspx?SiteID=266)
- [Wallace toxin table](https://www.nwtoxicalgae.org/Data.aspx?SiteID=91)
- [Clark water notices](https://clark.wa.gov/public-health/public-beaches), underlying layer links retained per spot
- [Oxbow](https://www.oregonmetro.gov/places/oxbow-regional-park)
- [Lewis River facilities](https://www.pacificorp.com/community/recreation/washington.html)
- [East Fork restoration](https://www.estuarypartnership.org/our-work/habitat-restoration/east-fork-lewis-river-reconnection-project)
- [West Bridge project updates](https://www.i205corridor.org/updates)
