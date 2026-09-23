# Morning Coffee 

привіт
почаю свий проект
потрібна допомога з кодом

Create a Progressive Web App called "No Clicks. Just Coffee" (NCJC) — a daily marketing newsletter/newspaper website.

DESIGN DIRECTION (visual reference style — organic editorial look)

Aim for a warm, editorial, organic feel similar to sites like CoLabs: large bold sans-serif headline typography, generous whitespace, a soft cream/off-white background, big rounded "blob-style" cards with one large asymmetric corner radius (not uniform rounding — more organic, like a card with one heavily rounded corner), a small circular badge element somewhere on the page, and 2-3 accent colors used only in card blocks (not everywhere) — for NCJC use a coffee-brown, a deep green, and a muted gold as accents against the cream background. Keep the navigation bar minimal and pill-shaped/rounded, sitting slightly inset from the top edge. This should feel calm and premium, not like a busy news aggregator.

BRAND & COPY

- Site name "No Clicks. Just Coffee" centered in the header/top navigation, with "NCJC" as a compact logo mark on small screens.

- Tagline directly under the name: "Marketing trends, minus the noise."

- Hero/about section text: "NCJC is your daily marketing newspaper, bringing together the latest news, trends, campaigns, tools, and ideas worth knowing. We cut through the endless stream of updates and give you what actually matters, so you can stay current, spot what's changing, and start your day with a clearer view of marketing."

HEADER

- Site name centered, tagline below it.

- Top-right corner: Instagram icon and LinkedIn icon (simple outlined circular icon buttons, like in the CoLabs reference), linking to placeholder URLs (#instagram, #linkedin — to be replaced later with real profile links).

LAYOUT — TOP TO BOTTOM

1. Header as described above.

2. "Quote of the Day" block: a short motivational/marketing quote, visually distinct (larger italic type, subtle divider lines above/below). Data comes from Supabase table `quotes`, filtered to today's date; this table is populated daily by a separate scheduled backend script (AI-generated, not a preset list) — frontend just reads today's row.

3. Background music player: small, unobtrusive fixed bar (bottom-right corner) with a play/pause button and a volume slider — lounge/lofi ambient track, muted by default on load, user unmutes manually. Use a simple HTML5 <audio> element with loop and a compact custom-styled control (no browser default UI).

4. Article feed: grid or single-column list of cards, one per article. Each card:

   - Large, organic rounded corners (one corner more rounded than others, matching the design direction above), soft shadow, cream/white card background

   - Title (bold, editorial)

   - Short AI-written summary (60-90 words)

   - Source attribution line: "As reported by [Source Name]" linking to source_url

   - Footer row inside card with: ❤️ Like button (shows count, click increments), ↗ Share button (uses native Web Share API on mobile, falls back to "copy link" toast on desktop), and relative publish time ("2h ago")

   - Data from Supabase table `posts` (id, title, summary, source_name, source_url, likes_count, created_at) — only show posts from the last 24 hours, newest first.

5. Email signup section near the bottom: one-field form ("Get NCJC in your inbox") — email input + submit button, saves to Supabase table `subscribers` (id, email, created_at), success confirmation state, email format validation, prevent duplicate emails.

6. Footer: minimal, site name + tagline repeated small, Instagram/LinkedIn icons repeated here too.

TECHNICAL REQUIREMENTS

- PWA: web app manifest (name "No Clicks. Just Coffee", short_name "NCJC", theme/background colors matching the cream + coffee-brown palette, display: standalone), service worker for offline shell caching, app icons at 192x192 and 512x512 (simple coffee-cup or minimal "NCJC" wordmark icon).

- Connect Supabase as backend. Tables with Row Level Security enabled:

  - posts (id uuid pk, title text, summary text, source_name text, source_url text, likes_count int default 0, created_at timestamp default now())

  - quotes (id uuid pk, text text, author text, shown_on date, created_at timestamp default now())

  - subscribers (id uuid pk, email text unique, created_at timestamp default now())

- Likes: anonymous increment on posts.likes_count (no login) via RLS policy allowing increment from anon role; store liked post_ids in localStorage so the same visitor can't like the same post twice per session.

- Posts feed queries only rows from the last 24 hours — older posts simply don't appear (the actual daily cleanup/regeneration happens in a separate scheduled backend job, not in the frontend).

- Fully responsive, mobile-first (primary use case is installing on phone).

- Fast and lightweight — this is a quick morning read, not a heavy app.

Do NOT build the article-generation or quote-generation logic (RSS fetching, AI summarization, daily automation) — that is handled separately by scheduled backend functions. Just build the frontend, PWA shell, and the Supabase schema/connections described above.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0c99dceb-a7fa-47f5-9a7e-d65919c3a5fa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
