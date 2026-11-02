# Oregon general-area audit, November 1, 2026

Enumerated all 178 Oregon records and inspected their names, regions, marker coordinates, and separation from parking/fishing coordinates. This is an area-identity audit, not a fresh legal-access audit for every bank. No Google search-resolution claim is made for every record.

## Findings

- Two clear area-marker mismatches: Powers Marine pointed to its parking approach across the river; Cedar Island pointed to its Mary S. Young parking approach. Proposed corrections are general-area markers only.
- Eight river listings use only Sandy River or Hood River as their area name. Proposed specific labels avoid losing the named access identity.
- Other Oregon markers were within the expected regional envelope. No stored marker differed by over 100 metres from its supported fishing pin. This consistency does not independently prove a pin correct.
- Three long marker-to-parking distances are explained by documented walking routes: Frog Lake, Mirror Lake, and Lower Twin Lake. They are not unexplained location swaps.
- Twenty-eight records put the marker at parking while withholding the fishing pin. That can be appropriate for an access area; it must not turn into a stand-here claim.

## Additional sources and limits

OHA Lower Willamette Recreation Map was newly considered for Powers Marine. It independently lists Sellwood and Powers as distinct recreation areas. Portland's own directions URL provides the west-bank entrance point. Esri imagery was retrieved with its returned extent and inspected around the proposed point. Cedar Island was cross-checked against freshly fetched county park geometry and a newly considered Oregon Hikers feature coordinate. The indexed guide was readable but its direct page returned 403. A new centered Esri image shows the feature coordinate on the island. The official park polygon centroid falls in the horseshoe-shaped lagoon, so it is deliberately not proposed. County geometry and imagery metadata are saved in scratch. The City of Sandy access-inventory URL failed in the search tool. A newly considered Metro Sandy River Water Trail PDF appeared in indexed search but its direct URL returned 404. Those failures supply no new access confirmation. Existing source-backed Revenue and Barlow names can be clarified without changing pins or availability.

## Proposed changes

### powers-marine-south-bank

Proposed: `{"generalAreaName": "Powers Marine Park", "lat": 45.46428, "lng": -122.66793}`

The old general marker was the east-bank Sellwood parking approach. Portland names Powers Marine on the west bank and its official Get directions link supplies the proposed entrance-area coordinate. The centered aerial aligns that point with the west end of Sellwood Bridge and park approach. Area identity review only. Preserve access, availability, parking and fishing pins.

- https://www.portland.gov/parks/powers-marine-park
- https://www.google.com/maps/dir//45.46428,-122.66793
- https://www.oregon.gov/oha/ph/healthyenvironments/trackingassessment/environmentalhealthassessment/pages/lower-willamette-river-recreation-map-(portland-metro-area).aspx
- https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=-122.67193%2C45.460280000000004%2C-122.66393%2C45.46828&bboxSR=4326&imageSR=4326&size=600%2C600&format=jpg&f=json

### or-cedar-island-bank

Proposed: `{"generalAreaName": "Cedar Island Park", "lat": 45.39028, "lng": -122.62743}`

The old general marker duplicates the Mary S. Young parking approach south of the island. The proposed approximate island-area coordinate is the Oregon Hikers named feature point. Clackamas County park geometry places it in Cedar Island, and a newly centered aerial shows island land at the point. It is not a verified fishing platform or route endpoint. Area identity only. Oregon Hikers text and feature coordinate were available in indexed search; direct page fetch returned 403. County geometry was fetched directly and saved. Do not replace Parking or Fish here pins. No closure or bridge-status refresh is claimed.

- https://westlinnoregon.gov/parksrec/cedar-island
- https://www.oregonhikers.org/field_guide/Cedar_Island
- https://services3.arcgis.com/I2eWXOndpF9m8oKC/arcgis/rest/services/Recreation_ORCA/FeatureServer/0/query?where=OBJECTID%3D45&outFields=*&returnGeometry=true&outSR=4326&f=json
- https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=-122.62893%2C45.38878%2C-122.62593000000001%2C45.39178&bboxSR=4326&imageSR=4326&size=500%2C500&format=jpg&f=json

### sandy-glenn-otto-beach

Proposed: `{"generalAreaName": "Glenn Otto Community Park"}`

Existing generalAreaName names only the entire river. Use the specific access-area identity while retaining the current coordinate-centered area destination. Area identity review only. Preserve access, availability, parking and fishing pins.

- https://www.troutdaleoregon.gov/publicworks/page/glenn-otto-community-park

### sandy-dodge-confluence-bank

Proposed: `{"generalAreaName": "Dodge Park"}`

Existing generalAreaName names only the entire river. Use the specific access-area identity while retaining the current coordinate-centered area destination. Area identity review only. Preserve access, availability, parking and fishing pins.

- https://www.portland.gov/water/visit-dodge-park

### sandy-hatchery-cedar-mouth

Proposed: `{"generalAreaName": "Sandy River at Cedar Creek, below Sandy Hatchery"}`

Existing generalAreaName names only the entire river. Use the specific access-area identity while retaining the current coordinate-centered area destination. Area identity review only. Preserve access, availability, parking and fishing pins.

- https://myodfw.com/sandy-hatchery-visitors-guide

### sandy-revenue-bridge-bank

Proposed: `{"generalAreaName": "Revenue Bridge, Sandy River"}`

Existing generalAreaName names only the entire river. Use the specific access-area identity while retaining the current coordinate-centered area destination. Area identity review only. Preserve access, availability, parking and fishing pins.

- https://www.americanwhitewater.org/content/River/view/river-detail/point-of-interest/access/qvLBXmsxillBwNyR40swA

### sandy-marmot-gravel-bank

Proposed: `{"generalAreaName": "Marmot Recreation Site"}`

Existing generalAreaName names only the entire river. Use the specific access-area identity while retaining the current coordinate-centered area destination. Area identity review only. Preserve access, availability, parking and fishing pins.

- https://www.recreation.gov/activitypass/554be6a2-a5a0-11ec-9100-228a5ed15ebb

### sandy-barlow-carry-in-bank

Proposed: `{"generalAreaName": "Barlow Wayside river-access area"}`

Existing generalAreaName names only the entire river. Use the specific access-area identity while retaining the current coordinate-centered area destination. Area identity review only. Preserve access, availability, parking and fishing pins.

- https://www.clackamas.us/parks/barlow

### hood-river-lower-footbridge-bank

Proposed: `{"generalAreaName": "Hood River confluence and lower footbridge"}`

Existing generalAreaName names only the entire river. Use the specific access-area identity while retaining the current coordinate-centered area destination. Area identity review only. Preserve access, availability, parking and fishing pins.

- https://www.portofhoodriver.com/waterfront

### hood-tucker-park-bank

Proposed: `{"generalAreaName": "Tucker Park"}`

Existing generalAreaName names only the entire river. Use the specific access-area identity while retaining the current coordinate-centered area destination. Area identity review only. Preserve access, availability, parking and fishing pins.

- https://www.hoodrivercounty.gov/tuckerpark2

## Complete record inventory

| ID | Area name | Marker | Audit result |
|---|---|---|---|
| hagg-lake-sain-creek | Henry Hagg Lake | 45.484719, -123.233749 | No obvious area-identity mismatch in this review |
| vernonia-lake | Vernonia Lake | 45.856001, -123.176036 | No obvious area-identity mismatch in this review |
| trojan-pond | Trojan Pond | 46.036566, -122.890947 | No obvious area-identity mismatch in this review |
| st-louis-ponds | St. Louis Ponds | 45.113543, -122.932739 | No obvious area-identity mismatch in this review |
| commonwealth-lake | Commonwealth Lake | 45.512144, -122.808429 | No obvious area-identity mismatch in this review |
| blue-lake-regional-park | Blue Lake | 45.55384, -122.447229 | No obvious area-identity mismatch in this review |
| dorman-pond | Dorman Pond | 45.613496, -123.245618 | No obvious area-identity mismatch in this review |
| bethany-lake | Bethany Lake | 45.556605, -122.873095 | No obvious area-identity mismatch in this review |
| progress-lake | Progress Lake | 45.429374, -122.832624 | No obvious area-identity mismatch in this review |
| faraday-lake-north-shore | Faraday Lake | 45.265899, -122.313651 | No obvious area-identity mismatch in this review |
| north-fork-reservoir-lower-bank | North Fork Reservoir | 45.23902, -122.258935 | No obvious area-identity mismatch in this review |
| benson-lake-west-bank | Benson Lake | 45.577057, -122.127025 | No obvious area-identity mismatch in this review |
| hartman-pond-east-dock | Hartman Pond | 45.576575, -122.131836 | No obvious area-identity mismatch in this review |
| trillium-lake-dam-bank | Trillium Lake | 45.267618, -121.742556 | No obvious area-identity mismatch in this review |
| high-rocks-park-gladstone | High Rocks Park Gladstone Oregon | 45.379908, -122.582295 | No obvious area-identity mismatch in this review |
| riverside-park-clackamas | Riverside Park Clackamas Oregon | 45.397041, -122.560485 | No obvious area-identity mismatch in this review |
| milo-mciver-riverbend-bank | Milo McIver State Park Oregon | 45.312351, -122.381268 | No obvious area-identity mismatch in this review |
| sandy-dabney-riverfront-bank | Dabney State Recreation Area | 45.514928, -122.350158 | No obvious area-identity mismatch in this review |
| sandy-oxbow-coho-bank | Oxbow Regional Park | 45.493134, -122.295009 | No obvious area-identity mismatch in this review |
| west-salish-pond-northwest-platform | West Salish Pond | 45.529625, -122.450363 | No obvious area-identity mismatch in this review |
| sheridan-pond-south-bank | Southside Park Sheridan | 45.088073, -123.389704 | No obvious area-identity mismatch in this review |
| kelley-point-willamette-bank | Kelley Point Park west | 45.648028, -122.766146 | No obvious area-identity mismatch in this review |
| cathedral-park-downstream-bank | Cathedral Park downstream | 45.587103, -122.763199 | No obvious area-identity mismatch in this review |
| sellwood-riverfront-north-bank | Sellwood Riverfront Park north | 45.467149, -122.664433 | No obvious area-identity mismatch in this review |
| powers-marine-south-bank | Powers Marine Park south | 45.465847, -122.663034 | Correction proposed |
| cedaroak-upstream-bank | Cedaroak upstream | 45.389825, -122.628722 | No obvious area-identity mismatch in this review |
| meldrum-bar-south-bank | Meldrum Bar south | 45.376356, -122.615328 | No obvious area-identity mismatch in this review |
| clackamette-willamette-bank | Clackamette Park Willamette | 45.371617, -122.605558 | No obvious area-identity mismatch in this review |
| george-rogers-main-beach | George Rogers Park river beach | 45.41038, -122.659655 | No obvious area-identity mismatch in this review |
| haldeman-pond-south-bank | Haldeman Pond south | 45.707221, -122.815572 | No obvious area-identity mismatch in this review |
| gilbert-ramp-multnomah-channel-bank | Gilbert ramp Multnomah Channel | 45.791483, -122.799271 | No obvious area-identity mismatch in this review |
| walton-beach-bank | Walton Beach | 45.77032, -122.771331 | No obvious area-identity mismatch in this review |
| willow-bar-beach-bank | Willow Bar Beach | 45.731216, -122.766899 | No obvious area-identity mismatch in this review |
| prescott-beach-bank | Prescott Beach | 46.056151, -122.888835 | No obvious area-identity mismatch in this review |
| dibblee-beach-bank | Dibblee Beach | 46.115776, -122.98756 | No obvious area-identity mismatch in this review |
| chinook-landing-north-beach | Chinook Landing north beach | 45.561882, -122.44092 | No obvious area-identity mismatch in this review |
| rooster-rock-slough-bank | Rooster Rock Slough basin | 45.544335, -122.24841 | No obvious area-identity mismatch in this review |
| lewis-clark-sandy-north-bank | Lewis and Clark lower Sandy | 45.542691, -122.382014 | No obvious area-identity mismatch in this review |
| mirror-pond-north-entry | Mirror Pond north shore entry | 45.542692, -122.23781 | No obvious area-identity mismatch in this review |
| sturgeon-lake-oak-island-bank | Sturgeon Lake Oak Island | 45.708384, -122.811501 | No obvious area-identity mismatch in this review |
| willamette-park-west-linn-bank | Willamette Park West Linn | 45.338589, -122.650788 | No obvious area-identity mismatch in this review |
| tualatin-rood-bridge | Rood Bridge Park ramp | 45.49017, -122.95128 | No obvious area-identity mismatch in this review |
| tualatin-farmington | Farmington paddle launch | 45.449839, -122.949832 | No obvious area-identity mismatch in this review |
| tualatin-scholls | Scholls Bridge | 45.415186, -122.920516 | No obvious area-identity mismatch in this review |
| tualatin-eagle-landing | Eagle Landing | 45.413444, -122.938604 | No obvious area-identity mismatch in this review |
| tualatin-king-city | King City Community Park dock | 45.393275, -122.81787 | No obvious area-identity mismatch in this review |
| tualatin-99w | 99W Bridge stepped launch | 45.393612, -122.798448 | No obvious area-identity mismatch in this review |
| tualatin-jurgens | Jurgens Park river dock | 45.396688, -122.78374 | No obvious area-identity mismatch in this review |
| tualatin-cook | Cook Family Park ramp and dock | 45.397166, -122.773256 | No obvious area-identity mismatch in this review |
| tualatin-tualatin-community | Tualatin Community Park ramp | 45.387658, -122.762954 | No obvious area-identity mismatch in this review |
| tualatin-browns-ferry | Brown's Ferry Park river dock | 45.383156, -122.740873 | No obvious area-identity mismatch in this review |
| tualatin-stark | Stark Street public ramp | 45.383901, -122.734872 | No obvious area-identity mismatch in this review |
| hagg-a-bank | Henry Hagg Lake | 45.483895, -123.212073 | No obvious area-identity mismatch in this review |
| hagg-c-bank | Henry Hagg Lake | 45.490352, -123.230019 | No obvious area-identity mismatch in this review |
| hagg-dam-bank | Henry Hagg Lake | 45.476172, -123.200956 | No obvious area-identity mismatch in this review |
| hagg-elks-bank | Henry Hagg Lake | 45.470827, -123.206434 | No obvious area-identity mismatch in this review |
| gleason-broughton-bank | M. James Gleason Memorial Boat Ramp | 45.600816, -122.615903 | No obvious area-identity mismatch in this review |
| eastbank-duckworth-fishing | Eastbank Esplanade | 45.52508, -122.66612 | No obvious area-identity mismatch in this review |
| smith-bybee-bank | Smith and Bybee Wetlands Natural Area | 45.61673, -122.71835 | No obvious area-identity mismatch in this review |
| slough-columbia-blvd | Columbia Boulevard Slough launch | 45.61064, -122.7553 | No obvious area-identity mismatch in this review |
| slough-elrod | Elrod Levee public launches | 45.583452, -122.647839 | No obvious area-identity mismatch in this review |
| slough-airport | Airport Way Slough launch | 45.556913, -122.472845 | No obvious area-identity mismatch in this review |
| slough-simpson | Simpson Street Slough launch | 45.56532, -122.54851 | No obvious area-identity mismatch in this review |
| slough-headwaters | Columbia Slough Headwaters launch | 45.549988, -122.4569 | No obvious area-identity mismatch in this review |
| fairview-lakeshore-platform | Lakeshore Park Fairview Lake | 45.54994, -122.43844 | No obvious area-identity mismatch in this review |
| sauvie-ferry-ramp-bank | Sauvie Island Boat Ramp | 45.653645, -122.838448 | No obvious area-identity mismatch in this review |
| hadleys-landing-dock | Wapato Access Greenway State Park | 45.655707, -122.843103 | No obvious area-identity mismatch in this review |
| sauvie-little-mcnary | Little McNary Lake dirt-launch bank | 45.791227, -122.797876 | No obvious area-identity mismatch in this review |
| sauvie-steelman-west | Steelman Lake west hand-launch bank | 45.736438, -122.838781 | No obvious area-identity mismatch in this review |
| columbia-rainier-bank | Rainier Riverfront Park | 46.093401, -122.942314 | No obvious area-identity mismatch in this review |
| columbia-mayger-bank | Mayger Beach | 46.168144, -123.105796 | No obvious area-identity mismatch in this review |
| columbia-jones-bank | Jones Beach | 46.14, -123.306176 | No obvious area-identity mismatch in this review |
| columbia-pixie-bank | Pixie Park | 45.890516, -122.806116 | No obvious area-identity mismatch in this review |
| columbia-grey-cliffs-bank | Grey Cliffs Waterfront Park | 45.86825, -122.7987 | No obvious area-identity mismatch in this review |
| chapman-landing-bank | Chapman Landing Historical Park | 45.745225, -122.840855 | No obvious area-identity mismatch in this review |
| clatskanie-city-bank | Clatskanie City Park riverbank | 46.104444, -123.200432 | No obvious area-identity mismatch in this review |
| beaver-landing-bank | Beaver Landing ramp margin | 46.107439, -123.206381 | No obvious area-identity mismatch in this review |
| westport-bank | Westport Park slough bank | 46.136836, -123.372974 | No obvious area-identity mismatch in this review |
| nehalem-anderson | Anderson Park Nehalem | 45.85513, -123.191526 | No obvious area-identity mismatch in this review |
| nehalem-pittsburg | Pittsburg Nehalem launch | 45.902425, -123.151995 | No obvious area-identity mismatch in this review |
| nehalem-big-eddy | Big Eddy Park pool | 45.93136, -123.16383 | No obvious area-identity mismatch in this review |
| nehalem-nehalem-park | Nehalem River Park campground | 45.84953, -123.24161 | No obvious area-identity mismatch in this review |
| scaponia-creek-bank | Scaponia Park | 45.8442, -123.0942 | No obvious area-identity mismatch in this review |
| gales-creek-day-bank | Gales Creek Campground | 45.6426, -123.35955 | No obvious area-identity mismatch in this review |
| hornings-hideout-trout | Horning's Hideout | 45.67472, -123.013832 | No obvious area-identity mismatch in this review |
| yamhill-dayton | Dayton Landing Yamhill ramp | 45.222732, -123.072301 | No obvious area-identity mismatch in this review |
| yamhill-lafayette | Lafayette Locks | 45.230647, -123.101763 | No obvious area-identity mismatch in this review |
| yamhill-wennerberg | Wennerberg Park North Yamhill | 45.29133, -123.18688 | No obvious area-identity mismatch in this review |
| yamhill-joe-dancer | Joe Dancer Park South Yamhill | 45.21166, -123.17719 | No obvious area-identity mismatch in this review |
| sauvie-mud-lake-trail-bank | Mud Lake Sauvie Island | 45.7428, -122.83 | No obvious area-identity mismatch in this review |
| nehalem-timber-bridge | Nehalem River Timber Road Bridge | 45.80663, -123.2833 | No obvious area-identity mismatch in this review |
| swan-island-ramp-bank | Swan Island Boat Ramp | 45.56248, -122.70604 | No obvious area-identity mismatch in this review |
| hawkins-rock-creek-bank | Hawkins Park Vernonia | 45.8597, -123.192557 | No obvious area-identity mismatch in this review |
| or-barton-bank | Barton Park | 45.380486, -122.41168 | No obvious area-identity mismatch in this review |
| or-carver-bank | Carver Ramp | 45.392245, -122.495678 | No obvious area-identity mismatch in this review |
| or-cross-bank | Cross Park Gladstone Oregon | 45.378578, -122.589388 | No obvious area-identity mismatch in this review |
| or-feldheimer-bank | Feldheimer Park | 45.327677, -122.382141 | No obvious area-identity mismatch in this review |
| or-bonnie-bank | Bonnie Lure State Recreation Site | 45.351455, -122.376404 | No obvious area-identity mismatch in this review |
| or-eagle-fern-bank | Eagle Fern Park | 45.323049, -122.288284 | No obvious area-identity mismatch in this review |
| or-timber-bank | Timber Park | 45.299305, -122.347448 | No obvious area-identity mismatch in this review |
| or-estacada-mciver-bank | Estacada Boat Ramp | 45.297795, -122.349057 | No obvious area-identity mismatch in this review |
| or-promontory-bank | Promontory Park Boat Ramp | 45.223529, -122.245543 | No obvious area-identity mismatch in this review |
| or-feyrer-bank | Feyrer Park Oregon | 45.139299, -122.53446 | No obvious area-identity mismatch in this review |
| or-knights-bank | Knights Bridge | 45.26658, -122.711185 | No obvious area-identity mismatch in this review |
| or-wagon-bank | Oregon 213 Bridge at Wagon Wheel Park | 45.198763, -122.58033 | No obvious area-identity mismatch in this review |
| or-goods-bank | Goods Bridge | 45.244675, -122.686874 | No obvious area-identity mismatch in this review |
| or-canby-river-bank | Canby Community Park Oregon | 45.251685, -122.704864 | No obvious area-identity mismatch in this review |
| or-molalla-state-bank | Molalla River State Park Oregon | 45.296435, -122.7022 | No obvious area-identity mismatch in this review |
| or-hebb-bank | Hebb Park | 45.299095, -122.683064 | No obvious area-identity mismatch in this review |
| or-boones-marina-bank | Boones Ferry Landing | 45.291574, -122.774481 | No obvious area-identity mismatch in this review |
| or-boones-park-bank | Boones Ferry Park Wilsonville Oregon | 45.293606, -122.774819 | No obvious area-identity mismatch in this review |
| or-memorial-bank | Wilsonville Memorial Park | 45.293757, -122.760624 | No obvious area-identity mismatch in this review |
| or-tryon-bank | Tryon Cove | 45.42268, -122.65774 | No obvious area-identity mismatch in this review |
| or-milwaukie-bank | Milwaukie Bay Park | 45.441553, -122.642969 | No obvious area-identity mismatch in this review |
| or-mary-young-bank | Mary S Young Park West Linn Oregon | 45.3819, -122.6241 | No obvious area-identity mismatch in this review |
| or-cedar-island-bank | Cedar Island West Linn Oregon | 45.3806, -122.628 | Correction proposed |
| or-maddax-bank | Maddax Woods West Linn Oregon | 45.370364, -122.613627 | No obvious area-identity mismatch in this review |
| or-burnside-bank | Burnside Park West Linn Oregon | 45.372482, -122.618637 | No obvious area-identity mismatch in this review |
| or-westbridge-bank | McLean House West Linn Oregon | 45.36492, -122.60595 | No obvious area-identity mismatch in this review |
| or-swiftshore-bank | Swiftshore Park West Linn Oregon | 45.340502, -122.663623 | No obvious area-identity mismatch in this review |
| or-fields-bank | Fields Bridge Park | 45.349267, -122.676764 | No obvious area-identity mismatch in this review |
| or-tualatin-space-bank | Tualatin River Open Space 2414 Michael Court | 45.352755, -122.668452 | No obvious area-identity mismatch in this review |
| or-shipley-bank | Stafford Road - Shipley Bridge | 45.379214, -122.697019 | No obvious area-identity mismatch in this review |
| or-river-run-bank | River Run Park II Lake Oswego Oregon | 45.382793, -122.71472 | No obvious area-identity mismatch in this review |
| or-cove-bank | Clackamette Cove Access | 45.37038, -122.594742 | No obvious area-identity mismatch in this review |
| or-oak-grove-bank | Oak Grove Boat Ramp | 45.416745, -122.654224 | No obvious area-identity mismatch in this review |
| or-wilsonville-pond-bank | Wilsonville Pond Oregon | 45.264984, -122.782712 | No obvious area-identity mismatch in this review |
| or-woodburn-bank | Woodburn Pond Oregon | 45.173569, -122.853188 | No obvious area-identity mismatch in this review |
| or-champoeg-bank | Champoeg State Park | 45.254712, -122.883415 | No obvious area-identity mismatch in this review |
| or-rogers-bank | Rogers Landing | 45.286095, -122.965956 | No obvious area-identity mismatch in this review |
| or-butteville-bank | Butteville Landing | 45.262349, -122.843177 | No obvious area-identity mismatch in this review |
| or-san-salvador-bank | San Salvador Access | 45.224321, -123.026766 | No obvious area-identity mismatch in this review |
| or-wheatland-bank | Willamette Mission State Park | 45.089991, -123.044021 | No obvious area-identity mismatch in this review |
| or-ediger-bank | Ediger Landing | 45.091155, -123.046164 | No obvious area-identity mismatch in this review |
| or-mission-lake-bank | Mission Lake | 45.078115, -123.051904 | No obvious area-identity mismatch in this review |
| or-spongs-bank | Spongs Landing | 45.016221, -123.073535 | No obvious area-identity mismatch in this review |
| or-keizer-bank | Keizer Rapids | 44.9907, -123.053908 | No obvious area-identity mismatch in this review |
| or-wallace-bank | Wallace Marine Park | 44.944655, -123.046531 | No obvious area-identity mismatch in this review |
| or-walter-bank | Cascades Gateway Park | 44.909572, -122.990414 | No obvious area-identity mismatch in this review |
| or-walling-bank | Walling Pond Salem Oregon | 44.91803, -123.02455 | No obvious area-identity mismatch in this review |
| or-silverton-bank | Silver Creek Reservoir | 44.983415, -122.744901 | No obvious area-identity mismatch in this review |
| or-turner-bank | Turner Lake Park Oregon | 44.854827, -122.958012 | No obvious area-identity mismatch in this review |
| or-minto-bank | Minto Brown Island Park Salem Oregon | 44.9258, -123.0638 | No obvious area-identity mismatch in this review |
| or-sportcraft-bank | Sportcraft Landing | 45.364442, -122.602106 | No obvious area-identity mismatch in this review |
| or-spring-valley-bank | Spring Valley Access | 45.064035, -123.068248 | No obvious area-identity mismatch in this review |
| or-mciver-upper-bank | McIver State Park Upper Ramp | 45.29936, -122.36094 | No obvious area-identity mismatch in this review |
| or-oswego-bank | Millennium Park Paddle Access | 45.416998, -122.664114 | No obvious area-identity mismatch in this review |
| or-rivervilla-bank | Rivervilla Park Milwaukie Oregon | 45.423034, -122.654507 | No obvious area-identity mismatch in this review |
| or-salem-riverfront-bank | Salem Riverfront Park public dock | 44.942348, -123.044501 | No obvious area-identity mismatch in this review |
| or-culvert-bank | North Fork Reservoir Culvert bank | 45.233059, -122.253152 | No obvious area-identity mismatch in this review |
| or-elk-rock-bank | Spring Park Milwaukie Oregon | 45.4351, -122.6467 | No obvious area-identity mismatch in this review |
| or-meadowbrook-bank | Meadowbrook Bridge Molalla bank | 45.161165, -122.536078 | No obvious area-identity mismatch in this review |
| mt-hood-pond-north-bank | Mt. Hood Community College Pond | 45.51309, -122.39844 | No obvious area-identity mismatch in this review |
| east-salish-pond-north-bank | East Salish Pond | 45.529695, -122.44813 | No obvious area-identity mismatch in this review |
| sandy-glenn-otto-beach | Sandy River | 45.537562, -122.376942 | Correction proposed |
| sandy-dodge-confluence-bank | Sandy River | 45.44522, -122.2523 | Correction proposed |
| sandy-hatchery-cedar-mouth | Sandy River | 45.41184, -122.25566 | Correction proposed |
| sandy-revenue-bridge-bank | Sandy River | 45.4079, -122.23547 | Correction proposed |
| sandy-marmot-gravel-bank | Sandy River | 45.39926, -122.1364 | Correction proposed |
| sandy-barlow-carry-in-bank | Sandy River | 45.38165, -122.04045 | Correction proposed |
| rainbow-trout-farm-sandy | Rainbow Trout Farm | 45.37714, -122.1248 | No obvious area-identity mismatch in this review |
| dalton-point-east-bank | Dalton Point | 45.573563, -122.156427 | No obvious area-identity mismatch in this review |
| rooster-rock-columbia-beach | Rooster Rock | 45.54683, -122.24068 | No obvious area-identity mismatch in this review |
| cascade-locks-canal-bank | Cascade Locks Marine Park | 45.667441, -121.896869 | No obvious area-identity mismatch in this review |
| blackberry-beach-columbia-bank | Blackberry Beach | 45.687085, -121.854103 | No obvious area-identity mismatch in this review |
| herman-creek-lagoon-south-bank | Herman Creek Lagoon | 45.683883, -121.858695 | No obvious area-identity mismatch in this review |
| viento-columbia-bank | Viento State Park | 45.700171, -121.668541 | No obvious area-identity mismatch in this review |
| hood-river-lower-footbridge-bank | Hood River | 45.71097, -121.50751 | Correction proposed |
| hood-river-hook-inner-bank | The Hook | 45.716031, -121.526501 | No obvious area-identity mismatch in this review |
| hood-nichols-basin-bank | Nichols Basin | 45.71445, -121.5113 | No obvious area-identity mismatch in this review |
| hood-tucker-park-bank | Hood River | 45.65234, -121.5618 | Correction proposed |
| hood-punchbowl-confluence-bank | Punchbowl Falls Park | 45.604618, -121.634144 | No obvious area-identity mismatch in this review |
| kingsley-reservoir-day-bank | Kingsley Reservoir | 45.64025, -121.674569 | No obvious area-identity mismatch in this review |
| frog-lake-west-bank | Frog Lake | 45.216946, -121.69624 | No obvious area-identity mismatch in this review |
| mirror-lake-loop-bank | Mirror Lake | 45.297832, -121.79252 | No obvious area-identity mismatch in this review |
| lower-twin-lake-shore | Lower Twin Lake | 45.23596, -121.68046 | No obvious area-identity mismatch in this review |
| clear-lake-hood-day-bank | Clear Lake | 45.17806, -121.6978 | No obvious area-identity mismatch in this review |
| mosier-rock-creek-beach | Mosier Rock Creek Beach | 45.68703, -121.40429 | No obvious area-identity mismatch in this review |
