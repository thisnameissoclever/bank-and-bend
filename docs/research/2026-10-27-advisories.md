# Water-advisory follow-up, October 27, 2026

The four unresolved advisory labels were left after incomplete research. This follow-up pursued new source classes and the data behind failed interfaces. The results support specific dated findings. No active advisory was established for these four spots.

| Location | Finding | Evidence limit |
| --- | --- | --- |
| Battle Ground Lake | County explicitly reports no current advisories. | County posting last edited September 25. Routine E. coli monitoring ended for the season and resumes May 2027. |
| Klineline Pond | County explicitly reports no current advisories. | Same seasonal monitoring limit. |
| Horsethief Lake | No active advisory found in checked park and county notices; September 1, 8 and 22 samples below guidelines. | No October sample found. November 1 seasonal closure remains in force. |
| Wallace / South County Pond | No current advisory or closure found. County lists year-round opening; Toledo's adopted plan describes daylight access. | Latest lake-specific published toxin sample is July 20, 2010. Historical seasonal blooms are documented. |

## Clark County: working source path

The public advisory page links web map `020afad511874bb78f1c7450ef601334`. Its interface requested GIS sign-in, but the published map item is marked public. Standard anonymous ArcGIS REST requests returned its operational layers and advisory records. No authentication or access control was bypassed.

- [Map item metadata](https://gis.clark.wa.gov/portal/sharing/rest/content/items/020afad511874bb78f1c7450ef601334?f=pjson)
- [Map layer definitions](https://gis.clark.wa.gov/portal/sharing/rest/content/items/020afad511874bb78f1c7450ef601334/data?f=pjson)
- [Regional advisory data](https://gis.clark.wa.gov/arcgisfed/rest/services/Hosted/Regional_Water_Alerts_RO/FeatureServer/0/query?where=1%3D1&outFields=region%2Calert%2Cdetails%2Clast_edited_date&returnGeometry=false&f=pjson)
- [E. coli advisory data](https://gis.clark.wa.gov/arcgisfed/rest/services/Hosted/Ecoli_Beach_Monitoring_RO/FeatureServer/0/query?where=1%3D1&outFields=name%2Cposting_decision%2Cposting_details%2Clast_edited_date&returnGeometry=false&f=pjson)
- [Algae layer](https://gis.clark.wa.gov/arcgisfed/rest/services/Hosted/Harmful_Algal_Blooms_RO/FeatureServer/0)

Both regional and E. coli records explicitly report no current advisories for Battle Ground and Klineline. The data's last-edited timestamp is September 25, 2026. That is a posting date, not a sampling date. The linked Smartsheet dashboard was inspected in the browser and is explicitly for 2025; it was excluded from current status. Indexed newsletters were also dated 2025. County protocol distinguishes swimming warnings from algae danger advice that includes avoiding fishing. Do not treat every swim warning as a fishing closure.

## Horsethief

[State results](https://www.nwtoxicalgae.org/Data.aspx?SiteID=266) show September 22 microcystin of 0.400 micrograms/L and anatoxin-a below detection, both below guidelines. September 8 and September 1 were also below guidelines, following an above-guideline August 24 result. The [State Parks alert index](https://parks.wa.gov/about/news-announcements/alerts) was searched and its current indexed Columbia Hills section inspected. Direct retrieval returned 403. The section listed burn and climbing notices, with no lake-water warning. [Klickitat County algae information](https://www.klickitatcounty.gov/840/Algae-Blooms), the county homepage and Health Department notices produced no dated active advisory. Results for other states' Horsethief waters were excluded. The practical finding is no active advisory found, supported by the latest samples. It does not establish a formal lifting decision, October sampling or current shoreline signs. Those limitations do not establish an active hazard. Preserve the November 1 seasonal closure independently.

## Wallace

A live state database query for Lewis County and South County Pond revealed the latest pond sample is July 20, 2010: anatoxin-a 0.060 and microcystin 0.211 micrograms/L, both marked below guideline. The county summary's 2022 endpoint belongs to Reflection Lake. The 2010 values are historical, not evidence of present water quality. New sources included Toledo's adopted 2025 plan, its June 2026 council packet, county public-health news, water-program and laboratory pages, and dated stewardship updates. The plan establishes daylight access and historical early-summer swimming closures. School water monitoring plans do not establish toxin testing. No current restriction was found in the checked county, city or state sources. The full search and source audit is retained in `2026-10-27-advisory-evidence.json`.

## Product and rating decisions

Water quality now has separate structured findings, retrieval dates, sample or posting dates, source IDs, limitations and a next review date. Availability and regulation dates remain independent. All four remain candidates; no actual water-related fishing closure was found. The evidence review did not change the bank, crowding or fishery facts, so fit scores remain unchanged. Wallace research confidence remains 6 because recent toxin measurements are absent. No suitability penalty was added for missing documentation. The existing Friday refresh now explicitly reviews due water-quality records and uses these source paths. Next review is due October 30. It must pursue accessible alternatives, publish supported changes and identify a concrete blocker when necessary. A schedule is not a claim that a future check has already occurred.
