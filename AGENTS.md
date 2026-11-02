# Bank & Bend maintenance

Read docs/UPDATE-PROTOCOL.md before editing research and docs/ARCHITECTURE.md before changing storage or authentication. Follow any newer owner instructions. Preserve stable location IDs, journals, favorites, filter preferences, custom weights, availability revisions, and source dates.

Use concise, direct prose. Avoid em dashes, canned contrast phrases, filler, and explanations that crowd the interface. Apply the owner's latest supplied writing-style.md when it is available privately. Never commit private writing samples, owner names, a home origin, account IDs, credentials, or migration exports.

Dark mode is the initial appearance on desktop and mobile. Keep score colors and contrast readable. Filters match OR within a category and AND across categories. Score filters precede category checkboxes. The list and map must use the same filtered data.

Current-season prospects is the only fishing-opportunity score. Species and travel are filters, not scores. Privacy primarily measures how likely an angler is to be seen at the specified fishing position. Room to fish is secondary. Noise has no score. Preserve separate physical-space limits used by the overall-fit caps. Null scores are excluded from the weighted denominator. Custom importance values are independent 0-100 inputs.

Every access requires visual inspection, a supported shore-entry or fishing pin, and legal parking coordinates wherever attainable. Missing pins require specific visible explanations and further research. Never substitute a waterbody center for a standing position. An inactive location needs a concrete reason describing the obstacle.

Use current visitor location only in browser memory for road estimates. No location means unknown drive time. Never restore a private home origin. GPS fixes and movement history must not enter the database or exports. Device-local viewport, panel sizes, detail style and open detail survive refresh. Explicit shared links take precedence.

Public research is stored in data/spots.json and related audit files. Private records live in PostgreSQL. Source files must already be anonymized before committing; runtime redaction is an extra precaution. Old explanations are judgments to reconsider, not independent evidence.

Run the model, seasonal, privacy and storage tests, typecheck, and production build after relevant changes. Verify desktop and mobile interaction for UI changes. Confirm the saved Vercel deployment and reread changed research before reporting an update as live. Never claim research, authentication, data migration, or a deployment succeeded without checking its result.
