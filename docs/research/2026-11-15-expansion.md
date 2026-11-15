# Ten-mile coverage expansion, November 15, 2026

Added 21 distinct accesses, bringing the public corpus from 361 to 382 locations. Four new paid river properties bring paid coverage to 42 records. The existing paid-only and hide-paid filter and dollar-sign badges remain in both Google Maps and the Leaflet fallback. Rainbow Trout Farm, Horning’s Hideout and Indian Springs keep their stable IDs.

## Scope and screening

Used the convex envelope of the previous general map locators as a reproducible research perimeter and screened an approximate ten-mile outward buffer in every direction. This is a geographic research envelope, not a road-time boundary or a guarantee of exhaustive access coverage. The expansion ledger records the baseline hull, projection, 106 agency inventory leads in the new band, road screening and interior gap additions.

Compared WDFW’s access inventory and OSMB’s geographic boating inventory with park, fishery and operator sources. Road estimates use generic Vancouver city center only for public research screening. Outer examples take about 2–2½ hours without traffic. The browser drive filter now permits 150 minutes without resetting saved limits, availability, species, water types or paid-fishing choices. No visitor GPS or private origin was stored.

Added Lacey-area lake banks and Long’s Pond, Devils Lake park accesses, Albany park lakes, Foster Reservoir shores, Waterloo Park, Celilo Park, a lower Deschutes candidate, Riverbend’s Nisqually access and three Oregon Fishing Club river properties. All four supported water types are represented. Facility leads that still lack an individual bank review remain explicitly deferred in the ledger, rather than being presented as verified fishing recommendations.

## Paid fishing and current restrictions

The current Riverbend operator page publishes $35 daily, $150 monthly and $200 seasonal fishing passes. The public campground map marks Lower Bar and Middle Bar parking/fishing. Its exact check-in-to-bar route remains unresolved, so coordinates stay disabled. The 2026–2027 Nisqually rules close the lower reach on Sundays and Mondays late in the season, including Sunday, November 15; the annual season also ends November 15. The pass does not override fishing rules. Operator pages disagree about Saturday office hours, so the listing asks visitors to confirm them.

Reconsidered Trask River #2, Nestucca Pipeline and Nestucca River #1, previously outside the tighter paid screen, using public property descriptions, the public map and the confirmed membership plan. They are approximately 140–144 minutes from Vancouver in static road estimates. Membership prices and river-license requirements are attached. Public map markers do not identify authorized member entrances, parking or bank routes. These remain inactive with specific explanations; no member-only directions or gate codes were accessed.

Rechecked Rainbow Trout Farm’s length-based price table and Horning’s current fishing page. Updated only those fee claims and retrieval dates. Horning’s regular keeper fishery remains closed until May 2027. Indian Springs remains inactive because current appointments and its entrance are unresolved. The paid filter continues to offer inclusion of inactive spots, keeping these locations discoverable.

Parking passes and public-water licenses alone do not classify a site as paid fishing. Raines Resort is retained in the farther-lead ledger because its static route exceeds the expanded 150-minute screen. Producer listings and marina/ramp records do not independently establish a paid shore fishery.

## Access evidence and limitations

Inspected individual Esri aerial frames and converted coordinates from the returned extents. Approximate points identify visible parking or a supported bank/dock/shore entry. Image capture dates are unavailable. Legal entry, current footing and seasonal gate operations remain separate questions.

Cross-checked Long Lake’s broad WDFW inventory locator against the city’s annotated aerial showing the separate WDFW launch, purchased parcel and city park. Corrected parking into the launch bays and the fishing point to the north side of the ramp. WDFW prohibits fishing at Long Lake Park itself. Wanschers parking uses the park entrance, not the residential waterfront lot.

Holmes Road Park’s city address data and broad agency marker could not resolve the public entrance among residential parcels. Waterloo’s reviewed aerial could not distinguish legal day-use parking from campground pads and picnic grass. The Deschutes winter notice closes primitive loops without establishing the appropriate day parking in the reviewed frame. These unresolved routes remain inactive with missing-pin explanations. Do not follow a general locator as directions.

Hicks Lake is seasonally closed after October 31. Ward’s current year-round fishing listing conflicts with the access inventory’s September vehicle-access endpoint; winter gate access remains unconfirmed. Lewis Creek has a current low-water launch closure and no confirmed winter bank route. Sunnyside’s bank is distinct from the marina, where fishing is prohibited.

## Fishery, stocking and water

Matched WDFW’s underlying 2026 release records by exact waterbody and Thurston County, retaining returned historical events and distinguishing fingerlings from keeper-size fish. Lake St. Clair’s September cutthroat release is fingerlings. The two Hicks accesses share the same release history.

Retrieved ODFW water-specific schedules for Devils, Foster, Waverly and Freeway lakes and read the current regional report. Past scheduled weeks remain plans. Waverly’s November 23–27 plant is future scheduled stocking, not a delivery. Accesses on Devils and Foster share their respective waterbody’s events and advisory evidence. Monthly scores use fishery and seasonal evidence, not missing catch reports as proof of poor fishing.

Thurston County’s current table reports Pattison Lake microcystin at 84 µg/L from November 12, above its 8 µg/L recreation guideline. The new Pattison access is inactive for keeper fishing and carries the active advisory. OHA’s live layer retains a Devils Lake precaution; all three new Devils accesses carry it. Foster’s record reports below-human-guideline/non-detect status, without claiming a fresh local sample or fish-consumption clearance.

The same county table reports Offutt Lake at 57 µg/L from November 12. Added the active advisory to the existing Offut Lake Resort record while preserving its shared access override. A water-quality advisory is displayed independently of legal access availability.

Existing availability overrides were read at revision 305 and preserved. Public research updates do not overwrite journals, favorites, notes, custom weights, preferences or private Supabase records. Individual source links and checked dates remain in each record.

## Validation

All 21 test files pass, including model, seasonality, stocking, access, privacy, preference and isolated PostgreSQL checks. Typecheck and the production webpack build pass. A new regression check covers 120-, 135- and 150-minute road limits, persisted preferences and shared links.

Browser checks at 1440×1000 and 390×844 verify 42 paid results, 340 unpaid results, matching map/list counts, a dollar badge on every paid marker, removal of every paid badge when hiding paid spots, and persistence of the paid filter and 150-minute choice after reload. No horizontal page overflow was found. Existing source IDs and all 361 prior location IDs were preserved. Existing records changed only in the two rechecked fee panels and Offutt’s new advisory evidence.

ESLint still reports two pre-existing errors in FishingFinder.tsx, for its home anchor and an unescaped apostrophe. The same findings were confirmed against the unchanged baseline file; this update adds no new lint error.
