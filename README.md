# SLA — Smart Learning Assistant

A mobile-friendly installable web app starter for FBISE Class 11 and 12.

## Included
- Responsive dashboard and navigation
- Demo student profile and quiz history stored in this browser
- Biology, Chemistry, Physics and Mathematics sample MCQs
- Automatic scoring, answer explanations and quiz history
- FBISE syllabus source directory
- PWA manifest and service worker
- AI tutor chat interface connected to a separate secure backend once configured

## Run the website
1. Keep the folder structure intact.
2. Host the static app over HTTPS (the existing GitHub Pages deployment is retained).
3. Open the GitHub Pages URL.

## Activate the AI tutor

The public website must never contain a Gemini API key. The Worker source is in `worker/worker.js`.

1. An adult administrator should create and manage the AI provider account and review its age, usage, privacy and billing terms before enabling the service.
2. In Cloudflare, create a Worker and paste the contents of `worker/worker.js` into its editor, then deploy it.
3. In the Worker settings, add a secret named `GEMINI_API_KEY` and store the provider key there. Do not put the key in GitHub, `app.js`, or a public file.
4. Copy the deployed Worker HTTPS URL.
5. In `app.js`, replace `PASTE_CLOUDFLARE_WORKER_URL_HERE` in `AI_API_URL` with that Worker URL. Commit the change to GitHub.
6. Before making the tutor publicly available, configure request-rate limits and abuse protection on the Worker. CORS limits which websites can read responses; it does not prevent direct calls to a public endpoint.
7. Confirm the website has redeployed, then test a simple study question.

Cloudflare's current dashboard path for a Worker secret is **Workers & Pages → select the Worker → Settings → Variables and Secrets → Add → Secret**. Name it exactly `GEMINI_API_KEY`, then deploy the Worker again. See the [Cloudflare secrets guide](https://developers.cloudflare.com/workers/configuration/secrets/).

The Worker currently allows the GitHub Pages origin `https://troubleshooting345-svg.github.io`. If the website's domain changes, update `ALLOWED_ORIGIN` in `worker/worker.js`.

## Important limitations
- The app is a front-end prototype, not a production student-account system.
- Demo profile and marks are saved in browser local storage on this device; they are not synced or secure school records.
- Sample quiz questions are not an official FBISE question bank.
- The syllabus directory links to official sources; it does not claim all eight class/subject SLO sets have been transcribed.
- The AI tutor needs a deployed Worker and a valid provider secret. API usage may have limits or charges depending on the provider account and current terms. Have an adult administrator review this before enabling it.
- Do not enter passwords, private information, addresses, or contact details into study chats.

## Branding
The existing SLA branding and logo are retained.
