# CUE

Next.js 16 + Tailwind 4 site. Animation packages: `motion` and `@animate-ui/react`.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
npm run check:dashes # fails if an em or en dash is in the copy
```

## Where things are

- `app/`: one route per view: `/` Home, `/library`, `/components`, `/builder`, `/plans` (Why Cue and plans). `app/globals.css` holds the design tokens and the original styles; `app/pseudo.css` holds hover and press styles.
- `components/cue/CueApp.jsx`: the whole app, ported from the Claude Design file. It is generated, see `scripts/port/README.md`.
- `components/cue/CueTabBar.jsx`: phone tab bar (Animate UI Bottom Navigation). `CueToast.jsx`: toast (motion).
- `lib/`: template data and prompts (`library-data.js`), the 23 components and 16 animations (`component-data.js`), fixed settings (`config.js`).
- `public/`: hero templates (`templates/<id>/index.html`), preview media, icons, `manifest.webmanifest`, `sw.js`.
