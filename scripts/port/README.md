# Porting a Claude Design export

`components/cue/CueApp.jsx` and `app/pseudo.css` are generated from the Claude Design file `cue.dc.html`.
If the design changes in Claude Design, export it again and regenerate instead of editing by hand:

```bash
node scripts/port/convert.mjs path/to/cue.dc.html /tmp/body.jsx app/pseudo.css
node scripts/port/assemble.mjs path/to/cue.dc.html /tmp/body.jsx components/cue/CueApp.jsx
npm run build
```

`assemble.mjs` holds every change made on top of the export (routes, bundled data, absolute media paths,
the Library wall image fix, the Animate UI tab bar and the motion toast). It stops with an error if the
export no longer matches what a change expects, so nothing is lost silently.
