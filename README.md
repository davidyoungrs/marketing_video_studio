# Marketing Video Studio (Standalone)

Standalone, AI-driven marketing and sales explainer video studio. Explores live web applications via real Playwright browser automation, verifies workflows, and renders professional 1080p MP4 marketing videos using genuine product footage and voiceover.

## Quick Status & Context
- **Workspace Isolation:** 100% isolated at `/Users/davidyoung/marketing-video-studio`. Completely separate from `/Users/davidyoung/contact-tree`.
- **Target Application:** Really Simple Digital Business Cards (`https://www.reallysimpleapps.com`)
- **Current Milestone Target:** Setting Up a Free Digital Business Card (`RS-FEAT-001`)

---

## Key Project Documents & Specs

1. **Storyboard & Script Specification:**
   - [`docs/STORYBOARD.md`](file:///Users/davidyoung/marketing-video-studio/docs/STORYBOARD.md)
   - Contains the complete 5-beat breakdown, exact timestamps, narration script, genuine footage visual actions, and on-screen caption overlays.

2. **Feature Inventory:**
   - [`src/inventory/features.json`](file:///Users/davidyoung/marketing-video-studio/src/inventory/features.json)
   - Verified catalog of features, DOM selectors, expected outcomes, and verification evidence.

3. **Staging & Access Configuration:**
   - [`config/staging.config.json`](file:///Users/davidyoung/marketing-video-studio/config/staging.config.json)
   - [`docs/STAGING_ACCESS.md`](file:///Users/davidyoung/marketing-video-studio/docs/STAGING_ACCESS.md)

4. **Automation & Capture:**
   - [`src/automation/record_workflow.js`](file:///Users/davidyoung/marketing-video-studio/src/automation/record_workflow.js)
   - Automated 1080p Playwright recording script.

---

## Milestone 1 Plan & Progress
- [x] Strict workspace physical isolation established
- [x] Dedicated Git repository and package manifest initialized
- [x] Node dependencies (`playwright`, `@openvidstudio/mcp-server`) & Chromium installed
- [x] Live application exploration & DOM inspection on `reallysimpleapps.com`
- [x] Feature inventory cataloged (`RS-FEAT-001`)
- [x] OpenVidStudio MCP server configured in Antigravity
- [x] Storyboard & narration script drafted and documented
- [ ] Record 1080p genuine browser footage (`recordings/raw_footage.mp4`)
- [ ] Synthesize narration audio and sync to beats
- [ ] Render finalized 1080p MP4 with captions and loudness normalization (`-14 LUFS`)
- [ ] Verify playable MP4, duration, audio, and thumbnail in `output/`
