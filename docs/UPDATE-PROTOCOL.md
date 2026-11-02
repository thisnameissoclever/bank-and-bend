# Research updates

The public corpus lives in `data/spots.json`; related coverage and access audits live alongside it. Keep location IDs stable. Record source URLs, sample dates, retrieval dates, visual inspection methods, limitations and concise rating reasons. Do not place journals, home locations or identities in public research.

1. Read current research and shared availability revisions. Preserve personal data and custom scoring weights.
2. Check land-manager access notices, legal parking, the continuous parking-to-bank route, seasonal and emergency fishing rules, and relevant water advisories. Visually inspect imagery and ground photographs where available. A launch marker does not establish fishable bank access.
3. Consider at least one useful source beyond the previous list. Record what it contributes, including an unsuccessful search when relevant.
4. Reconsider previous rating reasons as judgments. Missing reports do not mean poor fishing. Keep confidence separate from suitability, and use null when there is no evidence for a rating.
5. Current-season prospects combine present fishing opportunity and useful keeper size. Monthly profiles follow Pacific dates automatically. A recent override requires score or explicit null, from, through, checkedAt, sourceIds and a concise reason. Do not extend an expired report without new evidence.
6. Distinguish scheduled stocking from confirmed delivery. Update every access on the same lake, pond or reservoir and retain the historical records. Follow docs/STOCKING.md.
7. Treat water quality separately from access. Missing testing is not an active advisory. An authority reporting no advisory differs from finding no advisory in searched notices. An expired notice alone does not establish clearance. Follow the dated advisory research for underlying monitoring queries when map interfaces fail.
8. Reopen an inactive access only when dated evidence supports usable legal bank access and addresses the original obstacle. Clear obsolete inactiveFrom dates, preserve applicable future closures, and give the next review a sensible date. Otherwise state the exact obstacle. Shared writes require the current expected revision and readback verification. Reconcile newer data after a conflict.
9. Update only checked dates for claims actually rechecked. Append concise source and reasoning notes; preserve historical facts and anonymous firsthand observations.
10. Run `pnpm test`, `pnpm typecheck`, and `pnpm build`. Review the changed data, commit to the existing repository and verify Vercel's saved deployment. Reread changed research from the deployed corpus before reporting it live.

Score definitions and anchors are in lib/score-definitions.ts and docs/SCORING.md. Availability is independent of a suitability score. Privacy concerns observer sightlines and likely traffic at the specific fishing position, with physical spacing secondary. Never use traffic noise as a personal-space penalty.

Check boat launches and nearby banks when reviewing coverage. Evaluate separate access points individually. A public park address is insufficient when its shore is inaccessible. Give each missing pin and inactive record a specific, grammatical explanation.

Keep weekly research schedules pointed at the authoritative deployment and authenticated update workflow. Change scheduled destinations only after the migration is verified. Report source-access failures precisely and leave unsupported changes unapplied.
