# Deploying The Backyard Steward Studio

Same shape as the moto-doc repo — a static `index.html` and one Vercel serverless function. No build step.

1. Create a new GitHub repo (e.g. `backyard-steward-studio`) and push these three files: `index.html`, `api/claude.js`, `vercel.json`.
2. In Vercel, import that repo as a new project (separate from the Waxed & Wicked project — one deploy per channel, as decided).
3. In the new Vercel project's Settings → Environment Variables, add `ANTHROPIC_API_KEY` with your key. This is the only required env var.
4. Deploy. No other config needed — `vercel.json` just rewrites `/api/claude` to the serverless function.

## What's different from the Waxed & Wicked repo

`api/claude.js` and `vercel.json` are byte-identical — the proxy backend needed zero channel-specific changes, confirming the core/config split from the architecture doc.

`index.html` carries the channel-specific pieces: The Backyard Steward voice and kill list (from the real profile you provided), a sixth documentary type ("Practical Guide / How-To") added to the shared story-engine list, wildlife-appropriate source domains in Extract and the Verify tab's source links, and a shorter working word-count target (~1,200–1,600 vs. Waxed & Wicked's ~3,500).

## Known open items — not blockers, but worth tracking

- No fixed outro sign-off line has been set (Waxed & Wicked has "Thanks for watching and stay wicked" — this channel doesn't have an equivalent yet). The prompt currently just asks for a warm, specific close.
- Word count target (1,200–1,600) is a working default, not confirmed against a published episode.
- No back-catalog reference scripts exist yet — the prompt is written to say so explicitly, and treats the first several real outputs as building the channel's calibration set.
- Source list (allaboutbirds.org, nwf.org, xerces.org, USDA PLANTS, state extension) hasn't been checked against real claims yet the way Waxed & Wicked's list has through production use.

Once a handful of real scripts run through this, the same "harden after real use" step from the Waxed & Wicked rollout plan applies here too.
