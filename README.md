# SLA — Smart Learning Assistant

A mobile-friendly installable web app starter for Class 11 and 12.

## Included in this starter
- Responsive dashboard and navigation
- Demo student profile (stored locally in this browser)
- Class 11 / Class 12 selector
- Subject and topic selection
- Sample Biology, Chemistry, Physics and Mathematics MCQs
- Automatic scoring, answer explanations and quiz history
- PWA manifest and service worker for install/offline shell
- AI assistant chat preview (live AI is not connected yet)

## Run it
1. Keep the folder structure intact.
2. Open `index.html` in a browser for a basic preview.
3. For installability and service-worker support, host it on HTTPS (for example, GitHub Pages).

## FBISE syllabus directory\n- Added a class 11 / class 12 syllabus browser for Biology, Chemistry, Physics and Mathematics.\n- Official FBISE curriculum and assessment-framework links are provided.\n- Chapter lists are intentionally not labelled complete until the applicable 2026–27 subject documents have been checked and transcribed. The quiz topics remain sample topics.\n\n## Important limitations
- This is a front-end prototype, not a production student-account system.
- Demo profile and marks are saved in the browser's local storage on the current device. They are not synced between devices and are not secure school records.
- The included questions are sample practice questions, not an official FBISE question bank.
- The AI chat is a preview. Live AI requires a backend endpoint and a provider API key. Never place a private API key directly in `app.js` or any public front-end file.
- Notifications, calendar sync, real authentication, cloud database and AI generation need backend integration.

## Suggested free-tier next steps
- Create a Supabase project for authentication and database storage.
- Add tables for profiles, subjects, chapters, quizzes, questions, attempts and responses.
- Use a Supabase Edge Function to call an AI provider securely. Store provider secrets as server-side environment secrets, never in the browser.
- Deploy the static PWA on GitHub Pages or another host with a free tier. Free-tier availability and limits can change.

## Branding
Your uploaded AI logo is included at assets/logo.png.
