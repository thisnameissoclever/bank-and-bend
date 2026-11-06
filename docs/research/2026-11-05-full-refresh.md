# Full research refresh, November 5, 2026

The corpus now has 328 access records. This pass reviewed corpus consistency, current access notices, seasonal evidence, stocking and water-quality findings. It added four individually inspected accesses, refreshed 161 shared availability records with revision checks, and checked the stocking sources for 77 waters represented by 99 access records.

The per-access coverage ledger is `data/research-refresh-2026-11-05.json`. Source retrieval dates are November 5 Pacific, with some UTC timestamps falling on November 6. A retrieved page is not automatically proof of every claim on it. Existing visual-inspection dates remain unchanged except for the four new entries.

## Added river access

- Upper Clackamas: Moore Creek, Hole in the Wall and Sandstone. [PGE](https://portlandgeneral.com/about/parks-campgrounds/clackamas-river-access-sites) and the current [Marine Board report](https://www.oregon.gov/osmb/boater-info/pages/opportunities-and-access.aspx) explicitly identify these public sites as open. Aerial inspection supports designated parking and a connected shore-entry approach. The water-trail guide and a Sandstone ground account add route detail. These are whitewater-river accesses, with conditions judged at the near-bank position.
- All three Upper Clackamas entries are inactive for the current fishing trip. The [Willamette Zone rules](https://www.eregulations.com/oregon/fishing/willamette-zone) close stream-trout fishing after October 31 and prohibit salmon/steelhead angling above Cazadero Dam year-round. Native trout are generally release-only during the open season. Keeper prospects remain null because no useful local brook/brown-trout or stocked keeper fishery was established.
- Willamette: Independence Riverview Park. The [city's dated reopening notice](https://www.ci.independence.or.us/closure-faq/) explicitly reopens the park through December 31. The parking lot, park path and gravel shore entry were inspected against the [water-trail access description](https://willamettewatertrail.org/map/independence-riverview-park/). The separate northbound river trail remains closed. Preserve the January 1 future closure until a new city notice supports continued access.
- All 37 maintained Willamette mainstem records now begin with the river name so a river search reliably finds the existing parks and banks. Stable IDs and personal records are unchanged.

## Stocking and current fishing evidence

The WDFW delivery queries contain no newer matching catchable-trout delivery than the earlier November 5 stocking pass. Battle Ground's October 26-27 plants, Klineline's October 26 plant and Lacamas's October 27 plant remain the latest relevant local deliveries. Riffe's recent juvenile release remains distinct from a dinner-sized stocking opportunity.

The current [ODFW Willamette report](https://myodfw.com/recreation-report/fishing-report/willamette-zone) lists 9,000 trout for Henry Hagg, 1,000 for Walter Wirth and 2,500 for Turner in the week of November 2. These have scheduled status because the table does not certify a delivery. Turner's separate detailed schedule lists 1,000 for November 9-13. Both attributed plans are retained; the discrepancy is explicit.

The [October 26-November 1 WDFW survey](https://wdfw.wa.gov/sites/default/files/2026-11/swwa-fishing-reports-oct-26-nov-1-2026.pdf) supports new short-lived overrides through November 9. Counts use surveyed bank anglers, not boats or raw river totals:

| Survey section | Keepers / surveyed bank anglers | Current judgment |
| --- | --- | --- |
| Kalama River | 3 / 9 | 6.5, worthwhile late-run attempt, small sample |
| Lewis River | 13 / 93 | 5, modest bank success |
| Cowlitz above I-5 | 0 / 42 | Modest current prospects; retain lower-river comparison separately |
| Cowlitz below I-5 | 6 / 48 | Some coho retained, without extending that evidence to an exact bank |
| Bonneville Columbia section | 4 / 12 | 6.5 where legal bank access is supported |
| Drano Lake | 0 / 5 | 4; boat success is not substituted for bank results |
| Washougal River | 0 / 2 | Too small a sample for a strong downgrade |

Kalama Marine/Rasmussen is on the Columbia. Its 0/6 Columbia sample is kept separate from the tributary's 3/9 result. The PGE daily Clackamas trap spreadsheet adds October 26-30 passage data: 376 early coho and 9 late coho, with no downstream recycling in those rows. These counts establish passage, not catches. No old report expiry was extended without new evidence. Two historical overrides remain expired and are ignored automatically.

[November Columbia updates](https://myodfw.com/articles/regulation-updates) are reflected in the relevant mainstem records: Chinook release, the two-adult combined limit, and the different coho marking rule upstream of the Hood River Bridge. Tributary rules remain separate. Existing monthly profiles continue to change by Pacific date without code changes.

## Access and availability

Kalama Beginners' Hole reopens for conventional tackle because the specific fly-only period ended October 31, and WDFW still documents the public parking and bank access. This resolves the original method restriction; it does not infer access from an expired construction notice.

The additional [Corps operational-status table](https://corpslakes.erdc.dren.mil/visitors/status.cfm?state=OR), updated October 30, explicitly lists Hamilton Island and North Shore open. This supplied a useful alternative after the main district recreation page returned HTTP 403. Yale's November 8 ramp closure is kept separate from its remaining day-use bank access. Genuine park and fishing-season closures remain in place.

The farm's old fishing URL failed, but following a new tourism source reached its working [visitor page](https://rainbowtroutfarm.com/plan-your-visit/) and [hours page](https://rainbowtroutfarm.com/contact/). March-December hours are Monday and Thursday-Sunday, 8 a.m.-5 p.m. The private stocked-pond operation has no public dated replenishment log.

Unresolved private-property boundaries, unlocated legal parking and missing continuous routes remain explicit obstacles. The review did not manufacture new shore pins beneath canopy or reopen an inaccessible bank simply because no new closure was found. Existing imagery and route audits were reconsidered against current notices, with fresh aerial inspection limited to the four new accesses.

All 161 proposed availability writes were read back exactly, including their incremented revisions. Shared revision advanced from 144 to 305. The old fishing connector still targets the legacy site, and the Supabase connector exposes a different project. Maintenance therefore used the authorized Bank & Bend database through an ephemeral Vercel sandbox with verified TLS, the existing owner identity, per-record revision checks and atomic audit writes. The first command timed out after 112 accepted records; readback identified the remaining 49, which were applied and verified without duplicating accepted writes. Only the availability and availability-audit tables were written. The sandbox was stopped.

## Water quality

- Clark County explicitly reports no current advisory for Battle Ground and Klineline. Routine sampling has ended for the season; September 25 is the posting date, not a fresh November sample. Vancouver Lake's current source posting is October 29.
- Wallace Pond's old sample date and Horsethief's September sample remain distinct from retrieval dates. Missing testing is not an active warning. Horsethief remains seasonally closed independently of algae findings.
- The full public OHA advisory layer was read directly. Current precautions and genuine closures remain separate. Statewide bass guidance and lower-Willamette resident-fish restrictions were corrected where inconsistent. Shared lake findings were propagated to matching access records.
- Skamania County notice pages returned HTTP 403. Search indexing still exposes its August 27 Columbia notice without a current rescission or sufficiently precise extent. This specific source-access failure remains visible. No clearance is inferred from an absent warning-list entry.
- Statewide fish-consumption guidance fills previously missing separate findings where appropriate. It does not claim a local contact-water advisory search, recent sample or clearance.

## Evidence and validation

The source refresh fetched 1,001 existing URLs: 933 returned HTTP 200, 42 returned 403, 15 returned 404, six returned 503, and five had other errors. Status 200 establishes retrieval only. New useful sources include the Corps status table, PGE's underlying daily-count workbook, public Upper Clackamas water-trail information, the Independence reopening notice and the farm's working operator pages.

Ratings remain judgments. Missing documentation does not lower a fishing score, confidence does not enter suitability, and null prospects do not become zero. Historical catches, visits and prior unsuccessful fishing observations are retained. No application logic, authentication, custom weights, journals, filters or sharing settings changed.

Validation: all 115 model, seasonal, privacy, stocking and storage tests; TypeScript; production build. Publication and live corpus readback are verified separately after the commit.
