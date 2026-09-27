# Spitch waitlist site

The pre-launch website for Spitch: one landing page with a working waitlist form, plus draft `/privacy` and `/terms` pages.

Built with Vite, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix) for the accordion and form controls, Phosphor icons, and Supabase for storing waitlist sign-ups.

## Where things live

```
src/
  config.ts            BRAND ("Spitch"), SITE_URL, Supabase env vars
  content.ts           ALL site text: sections, FAQ, form messages, legal drafts, placeholders
  components/          one file per section (Hero, LaunchVideo, Problem, HowItWorks, ForYou,
                       ExamplePitches, Why, Trust, Pricing, Faq, FinalCta, Footer), plus
                       PitchCard, PhoneMockup, WaitlistForm, Navbar, Wordmark, ScoreDots
  components/ui/       shadcn/ui primitives (accordion, radio group, checkbox, label)
  lib/waitlist.ts      validation, mock mode, and the Supabase insert
  pages/               Landing, LegalPage (privacy and terms), NotFound
  index.css            design tokens and global styles
supabase/schema.sql    the waitlist table and its row level security
public/                favicon.svg (orange dot) and og.png (social share image)
scripts/og.html        source of og.png; scripts/make-og.mjs re-renders it
vercel.json            sends every path to index.html so /privacy and /terms work on refresh
.env.example           the two environment variables
```

- **Change any text:** edit `src/content.ts`. Components never hold copy.
- **Change the product name:** edit `BRAND` in `src/config.ts`. The page title and meta tags read it too, through a small plugin in `vite.config.ts`. The share image `public/og.png` is a picture, so re-render it after a rename (see below).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
npm run lint       # oxlint
```

Without Supabase keys, the form runs in **mock mode**: it validates everything, simulates success, remembers emails for the open session (so "You're already on the list." can be tested), and logs a console warning. Nothing is saved.

## Connect Supabase

1. Create a free project at [supabase.com](https://supabase.com). A Canadian region (Canada Central) keeps sign-ups in Canada.
2. Open **SQL Editor**, paste the whole of `supabase/schema.sql`, and run it. It creates `public.waitlist`, a unique index on the lowercased email, and turns on row level security with one policy: anonymous visitors can insert rows that have consent, and nothing else. They cannot read, update or delete.
3. Open **Project Settings, API** (or the **Connect** button) and copy the **Project URL** and the **anon / publishable** key.
4. Copy `.env.example` to `.env` and paste them in:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Restart `npm run dev`. Sign-ups now appear in **Table Editor, waitlist**.

The anon key is public by design. `.env` is gitignored, and no service-role key is used anywhere. A second sign-up with the same email returns error `23505`, which the site shows as "You're already on the list."

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New, Project**, import the repository. Vercel detects Vite: build command `npm run build`, output directory `dist`. Leave both as detected.
3. Before the first deploy, open **Environment Variables** and add, for Production and Preview:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
4. Deploy. `vercel.json` already rewrites every path to `index.html`, so `/privacy` and `/terms` load directly and on refresh.
5. Variables starting with `VITE_` are built into the site, so after changing one, redeploy (**Deployments**, the latest one, **Redeploy**).
6. Add your domain under **Settings, Domains**, then set `SITE_URL` in `src/config.ts` to it and redeploy.

## Share image

`public/og.png` (1200 x 630) is rendered from `scripts/og.html`. After changing the name, headline or colors:

```bash
npm i -D playwright && npx playwright install chromium
node scripts/make-og.mjs
```

## TODO before launch

- [ ] **Contact email**: replace `hello@spitch.example` in `src/content.ts` (`placeholders.contactEmail`). It appears in the footer, the privacy draft and the terms draft.
- [ ] **Launch video URL**: set `placeholders.videoUrl` in `src/content.ts` to a YouTube link or a direct `.mp4` URL. Until then the section shows "Launch video coming soon".
- [ ] **Launch date**: set `placeholders.launchDate` in `src/content.ts` once confirmed (for example `"March 2, 2027"`). It then appears in the FAQ answer "When does it launch?". Empty keeps the brief's answer.
- [ ] **Site address**: set `SITE_URL` in `src/config.ts` to the real domain. It feeds the canonical link and the Open Graph and Twitter tags.
- [ ] **Supabase**: create the project, run `supabase/schema.sql`, add both `VITE_` variables in Vercel, then submit a real test sign-up.
- [ ] **Legal review**: have `/privacy` and `/terms` reviewed, then remove the draft banner (`content.legal.draftBanner`) and the "(draft)" in the page titles (`content.legal.pageTitle`).
- [ ] **Launch emails (CASL)**: whichever tool sends the launch emails must identify the sender and include a working unsubscribe link in every email. The form collects the consent; the emails must honor it.
- [ ] **Final pricing**: confirm before the free launch period ends, and update the Pricing section and FAQ in `src/content.ts`.
- [ ] **Hosting plan**: Vercel's Hobby plan is for non-commercial personal use ([fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)). Check whether this site needs the Pro plan.
- [ ] **Share image**: if the name or headline changes, re-render `public/og.png` (see above).

## Assumptions

- **No template in the folder.** The NexStudio template by TailGrids was not in the working folder, so, as the brief allows, this is a new Vite + React + TypeScript + Tailwind CSS project with an original design. No template code or images are included, so no template attribution is needed.
- **Location.** The project lives in its own folder (`spitch/`), because the working folder only held tooling configuration.
- **shadcn/ui.** Initialized with the Radix base (`npx shadcn@latest init`), with the MCP server configured for Claude (`npx shadcn@latest mcp init --client claude`, which wrote `.mcp.json`). Only the accordion, radio group, checkbox and label are used, all restyled to the Spitch palette.
- **Icons.** Phosphor Icons, one family for the whole site.
- **Contrast.**
  - Orange text and icons on light backgrounds use a darker orange, `#B8400F`, because `#FF5A1F` on the paper color is below WCAG AA.
  - Muted text on dark sections uses `#A3A3AB`, because `#6B6B72` on ink is below AA.
  - Orange buttons carry ink text, at about 6:1.
  - The brief's colors are otherwise used as given.
- **Section headings.**
  - How it works, Pricing and FAQ use their navigation labels as visible headings.
  - "For you" is a visually hidden heading, because the two cards carry their own titles.
  - The Why statement's first sentence is its heading.
- **Example pitches.** The heading reads "Example pitches, for illustration". The hero phone shows the same "Campus food rescue" example (4/5), with "Study room finder" waiting behind it. None of the three examples names a university.
- **Pre-selected role.** The "Join the waitlist" button on the pitcher or builder card also pre-selects that role in the form. It can be changed.
- **Functional copy.** The brief does not include some small functional text, so it was written in the same tone:
  - form error messages, "Joining..." and "We'll email you when Spitch launches."
  - the organization helper text
  - mock app labels (Video pitch, AI summary, Needs, Compatibility)
  - accessibility labels, the 404 page, and the wording of the privacy and terms drafts
- **Honeypot.** A filled honeypot shows the normal success message but sends nothing, so bots get no signal.
- **Region name.** The en dash in "Ottawa–Gatineau" is joined with invisible word joiners in `content.ts`, so the name never splits across two lines. They are stripped from the meta tags.
- **Launch video.**
  - YouTube plays from `youtube-nocookie.com`, and nothing loads until the visitor presses play.
  - Any other URL is treated as a direct video file.
- **Motion.**
  - The hero rises in on load.
  - The phone's top card nudges right once, as a hint that pitches are swiped.
  - Sections fade up once as they scroll into view.
  - With reduced motion, all of it is off and everything shows at once.
- **Themes.** There is no separate dark mode. The brief's alternating ink and paper sections are the design.
- **Fonts.** Space Grotesk (headings) and Inter (body) are self-hosted through `@fontsource-variable`, with size-matched fallback fonts so text does not shift when they load.
- **Bundle.**
  - The main script is about 134 KB gzipped, mostly React and React Router.
  - `@supabase/supabase-js` is split out and only downloaded when someone submits the form with Supabase configured.
  - The privacy, terms and 404 pages are lazy-loaded.

## Credits and licenses

- Space Grotesk and Inter: SIL Open Font License 1.1, via Fontsource.
- Phosphor Icons, Radix UI, shadcn/ui, React Router, supabase-js: MIT.
- No stock photos and no hotlinked images. Every visual is CSS or code.
