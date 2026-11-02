// This allowlist intentionally exposes only a restricted browser API key.
// Never serialize runtime env or a server-side credential into this response.
export function publicMapsConfig(env: {GOOGLE_MAPS_BROWSER_KEY?: unknown}) {
 const key=typeof env.GOOGLE_MAPS_BROWSER_KEY==='string'?env.GOOGLE_MAPS_BROWSER_KEY.trim():'';
 return {provider:key?'google' as const:'usgs' as const,browserKey:key||null};
}
