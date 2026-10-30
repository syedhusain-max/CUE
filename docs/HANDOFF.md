# CUE handoff

Read this first. It is the state of the project and the agreed plan, so a new session can carry on without the old chat.

## Where things are

- Repo: `syedhusain-max/CUE` (public). Claude's GitHub app is installed, so pushes work.
- Live site: https://cuedesign.vercel.app (Vercel team `cue-b221`, project `cue`). It deploys from `main`.
- Preview: branch `v2-preview` is deployed at https://cue-git-v2-preview-cue-b221.vercel.app. It has NOT been merged; the owner has not yet approved it.
- The site today is one HTML file, `cue.dc.html`, exported from Claude Design. It runs on `support.js` (a small runtime) with React 18 from a CDN. There is no `package.json` and no build step. `vercel.json` rewrites `/` to `/cue.dc`.
- The repo is linked to a Claude Design project. A later sync from Claude Design could overwrite repo changes.

## Working rules the owner set

- Show a plan and get approval before any implementation.
- Everything goes to a preview branch first. Merge to `main` only after the owner says so.
- Explain things in plain, simple English.
- When building UI, use these skills: `consistent-ui:consistent-ui`, `mobbin:search`, `mobbin:redesign-screen`, `mobbin:plain-writing`. Note: Mobbin search failed with "requires a paid plan".
- Design rules are in `CLAUDE.md`: one accent `#e1e36b`, pills for controls, 24 to 28px card radius, no em or en dashes in visible copy, motion must be motivated, honour reduced motion.

## Legal line (do not cross)

The original Library came from another product, Scrolltide (scrolltide.co): template names, word-for-word descriptions, preview media and sales-page copy. All of it was removed on `v2-preview`. The owner asked to make previews "look exactly like" Scrolltide's; that was declined. Agreed approach: original templates, inspired by animation techniques only, every visual drawn in code, each preview recorded from the page its own prompt built. The same applies to React Bits Pro (a paid product the owner showed): borrow interaction ideas only, never its components, names, copy or code. Keep any growth hooks honest: no fake countdowns, invented counts or crossed-out reference prices.

## Done on v2-preview

- 5 original hero templates in `templates/<id>/index.html`: Inkwell, Night Shift, Quarry & Co, Monsoon, Atlas Rail. Data and full build prompts are in `library-data.js` (`prompt` field). Preview videos and posters are `media/t-<id>.mp4` and `.jpg`, recorded with Playwright from the real pages.
- Library cards play their video on hover (on screen for touch devices). The Free templates show an "Open live demo" link.
- All Scrolltide names, media and copied copy removed; untrue claims removed (builder count, fake countdown, crossed-out prices, features CUE does not have).
- Accessibility: `lang="en"`, `<main id="main">` on every view, skip link.
- Phone layout: bottom tab bar under 768px (Home, Library, Components, Builder, Plans).
- Installable app: `manifest.webmanifest`, `icons/`, `sw.js`.
- Components screen: a Customize panel (speed, delay, easing, reset) whose values flow into Copy spec.

## The approved plan, remaining steps

1. Owner reviews `v2-preview`, then merge to `main`.
2. Move CUE to a proper project (decided next: Next.js, with Tailwind) so npm packages work. Requested packages: `motion` and Animate UI (the owner typed `@animate-ui/react`; check Animate UI's own docs, its components are usually added with `npx shadcn add`). Port every current view faithfully, keep the design rules, keep the existing 23 components and 16 animations, and keep all v2 work.
3. The other 20 original hero templates, 5 at a time, same method (concept list already approved): Swell, Lumen Grid, Fold, Kiln, Ledger Lines, Pulse Run, Bloomfield, Static FM, Hollow Peak, Halftone, Typeset, Orbitly, Crate Digger, Fieldnote, Thermo, Gridlock, Matinee, Driftwood, Bento Labs, Cartograph. Tiers: Free are Inkwell, Swell, Lumen Grid, Night Shift, Ledger Lines, Hollow Peak, Fieldnote, Driftwood; the rest Premium.
4. 12 new live components (4 cursor, 4 text, 4 background), original, each with a live canvas, Customize panel, Replay, Swap animation, Add to page and Copy prompt. Send the list for approval first.
5. Accounts and payments: Supabase (auth, database, storage) and Lemon Squeezy (merchant of record; the owner has no UAE trade licence or UAE bank account, so Stripe UAE is out). The owner must create both accounts themselves. Rename the "Plans" tab to "Account" once accounts exist. Lock Premium demo pages behind sign-in.
6. Quick Build: users upload logo, images, icons, SVG, text and colours, pick header, hero, body and footer from the library, see it live, with progress steps and badges. Free to build and preview; paying unlocks export and premium sections.
7. Hall of Flame gallery (owner chose this name): publish a Quick Build, likes, comments, weekly ranking, report and hide tools, Terms and Privacy pages.
8. Open question: pricing is still $29 monthly, $9 a month yearly ($108), $239 lifetime. Ask the owner to confirm.

## Environment notes

- npm (`registry.npmjs.org`) is blocked from both the cloud workspace and the owner's linked computer. The owner can allow it under Claude Settings, Capabilities. Without it, code can still be pushed and Vercel installs packages during its own build, but nothing can be run locally first.
- CDNs (unpkg, jsdelivr, cdnjs) are blocked in the cloud workspace, so `cue.dc.html` does not render there. Check pages on the Vercel preview in the owner's Claude browser instead.
- The Vercel connector can read the `cue-b221` team but is refused when creating projects; dashboard actions went through the browser.
- Other uploads the owner provided (WhatsApp photos and videos, Scrolltide recordings) are not in the repo and must not be added.
