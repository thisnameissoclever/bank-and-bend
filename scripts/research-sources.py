"""Print the corpus's distinct source URLs for a topic; run with --help."""
import argparse
import json
from pathlib import Path

p = argparse.ArgumentParser(description=__doc__)
p.add_argument("topic", choices=["stocking", "prospects", "all"])
p.add_argument("--state", choices=["WA", "OR"])
p.add_argument("--spot", help="exact access ID")
args = p.parse_args()
urls = {}
spots = json.loads((Path(__file__).resolve().parents[1] / "data/spots.json").read_text())
for spot in spots:
    if args.state and spot["state"] != args.state or args.spot and spot["id"] != args.spot:
        continue
    stocking = spot.get("stocking") or {}
    records = ([stocking, *stocking.get("events", [])] if args.topic == "stocking"
               else [spot.get(k) or {} for k in ("seasonality", "seasonalOverride")] + [stocking])
    ids = {key for record in records for key in record.get("sourceIds", [])}
    for source in spot["sources"]:
        if args.topic == "all" or source["id"] in ids:
            urls.setdefault(source["url"], source["title"])
for url, title in sorted(urls.items()):
    print(f"{title}\t{url}")
