# Secure Staging Access Guide

## Target URL
`https://reallysimple-4gth097za-davidyoungrs-projects.vercel.app`

## Vercel Deployment Protection
The staging environment is protected by Vercel SSO / Authentication Protection.

### Access Options:
1. **Interactive Headed Browser Login (Recommended for manual verification):**
   Run the local Playwright session with a persistent user data directory:
   ```bash
   node src/automation/record_workflow.js --login
   ```
   Log into Vercel or your test account once. Playwright saves the session cookies in `.auth_session/` (gitignored), enabling subsequent automated unattended recordings.

2. **Vercel Automation Bypass Secret:**
   If your Vercel team has configured an `x-vercel-protection-bypass` secret, add it to `.env`:
   ```env
   VERCEL_AUTOMATION_BYPASS_SECRET=your_secret_here
   ```
   Playwright will automatically inject the `x-vercel-protection-bypass` header into every request.

3. **Production / Unprotected Custom Domain (Alternative):**
   If there is a public staging URL without SSO gating, update `config/staging.config.json`.
