# Map imagery

Close views use the USGS NAIP image service. Wide views use the USGS ImageryOnly tile cache. The detailed layer requests the exact Web Mercator bounds at zooms 16 through 19, with 512 by 512 output rendered into 256 CSS-pixel tiles. RGB bands 0,1,2, JPEG quality 95 and bilinear resampling keep natural colors. Source resolution and capture date vary by area. Each image is checked for a fully transparent or nearly black response before display. The imagery servers support cross-origin pixel inspection. A blank response, network error or 30-second timeout triggers one fallback to the corresponding crop of an overview tile at zoom 15. The map identifies this lower-detail fallback while those tiles remain loaded. Failed overview requests show an error message. Removed tiles cancel pending requests. Use real detail from the image service wherever it is available. Enlarged overview imagery provides continuity during a failure. It cannot establish additional shoreline detail or verify current access. Keep the attribution visible and dark inversion confined to the topographic layer. Keep React's root className static and toggle map display classes through classList so Leaflet retains its interaction classes. Remove layers before clearing their event listeners. Check Map/Satellite switching, close zoom, panning and access pins in the managed preview after changes. Official references:

- https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer
- https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer
- https://developers.arcgis.com/rest/services-reference/enterprise/export-image/

## October 24, 2026 repair evidence

Lewisville's former USDA CONUS NAIP endpoint returned HTTP 200 JPEGs with every RGB value equal to zero at tested zooms 16, 18 and 19. The same ground bounds returned visible imagery from the USGS NAIP endpoint at each tested zoom. The implementation now uses USGS and checks image content before accepting a successful response. This repair leaves fishing ratings and pin-verification dates unchanged.
