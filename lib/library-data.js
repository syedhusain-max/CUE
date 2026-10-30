// CUE original hero templates. Every visual is drawn in code (SVG, CSS, canvas):
// no stock images, footage or third-party assets, so each prompt rebuilds its preview exactly.
// Live demos: /templates/<id>/

const COMMON = `
## RULES
- One self-contained index.html: inline <style> and <script>, no libraries, no external images, fonts or CDNs.
- Fonts are system stacks only, so the page renders identically everywhere.
- Animate transform, opacity, SVG stroke offsets or canvas pixels. Never animate width, height or box-shadow.
- Smooth scroll-linked values with a lerp of about 0.1 per frame inside requestAnimationFrame.
- prefers-reduced-motion: skip intros and loops, show the final composed state.
- Accessibility: html lang="en", real <h1> text (aria-label on any decorative SVG headline), WCAG AA contrast, visible focus states, buttons at least 44px tall.
- No em dashes or en dashes in any visible copy.`;

export const TEMPLATES = [
{
  id:'inkwell', name:'Inkwell', category:'Hero Section', tier:'Free', isNew:true, hue:232, motion:'reveal',
  description:'A fountain-pen maker whose headline writes itself in ink as a pen glides across the line, then a blot bleeds out from the nib until the whole page turns ink blue.',
  prompt:`# Build prompt: Inkwell hero

## DIRECTION
A fountain-pen brand hero. Cream writing paper, deep ink blue, one gold nib. The headline is drawn as a pen stroke, then scrolling makes an ink blot bleed across the page until everything inverts to cream on ink.

## LAYOUT
- body height 320vh. A sticky 100vh stage centres the copy.
- Background #f2ebdd with a 5px dot grain (radial-gradient rgba(22,36,94,.08) 1px) and two hairline rules at 22% and 78% height.
- Copy block, centred, max 1100px: eyebrow pill "Inkwell Pens" (12px, 600, letter-spacing .22em, uppercase, 1px currentColor border, radius 999px).
- Headline "Write like it matters." as SVG <text> in a 1200x200 viewBox, x=600, text-anchor middle, textLength 1120, font Iowan Old Style / Palatino / Georgia, 132px, weight 600, stroke currentColor 1.4px.
- Lede: "Hand-tuned fountain pens with gold nibs, ground to the way you hold them." 20px system sans, max 520px.
- Two pill buttons: "Find your nib" (solid ink #16245e on cream text) and "Visit the studio" (1px outline).

## THE PEN
An inline SVG pen (300x60 viewBox): ink body rect rx 14 #0d1640, gold band #b8893a, gold nib triangle, a slit line and a breather hole. A small ink drop at the tip loops every 2.6s (scale in, fall 46px, fade). The pen is rotated -38deg and positioned with CSS variables --px and --py.

## MOTION
- Intro over 1.8s (eased with 1 - (1 - t)^3): stroke-dashoffset 900 to 0 draws the headline outline. Fill fades in during the last 40% of the intro.
- The pen x position follows the drawing: px = -460 + 1000 * drawProgress, plus pointer offset (x * 40, y * 30) and a gentle idle wobble (sin(t * 1.3) * 6).
- Scroll progress p (0 to 1 over the page): bleed = ease(segment(p, .40, .95)). An ink blot (SVG circles, radial gradient #0d1640 to #1d2f78, run through feTurbulence baseFrequency .045 plus feDisplacementMap scale 14 for ragged edges) is scaled from 0 to 1 around a point 58% down the stage. The blot element is 240vmax so it covers every screen.
- When bleed passes 0.45, switch the copy to cream (#f2ebdd) and the primary button to cream with ink text.
- The pen moves down 170px with the bleed and fades out over the last 40% of it.
${COMMON}`
},
{
  id:'night-shift', name:'Night Shift', category:'Hero Section', tier:'Free', isNew:true, hue:345, motion:'pulse',
  description:'A late-night coffee roaster sign that strikes on letter by letter with a stuttering neon flicker, a call to action that pulls toward your cursor, and a cup outline that lights up as you scroll.',
  prompt:`# Build prompt: Night Shift hero

## DIRECTION
A small-batch coffee roaster that roasts overnight. A dark brick wall, a pink neon sign, a cyan neon cup. Everything feels like a sign being switched on after closing time.

## LAYOUT
- body height 300vh, sticky 100vh stage, content centred.
- Wall background layers: a pink radial glow at 50% 42% whose alpha is 0.10 + 0.22 * glow, horizontal mortar lines every 49px (repeating-linear-gradient, rgba(0,0,0,.55) 3px), vertical joints every 107px, over a linear gradient #2a1418 to #160b0e to #0b0709.
- Eyebrow pill "Small batch roastery". Headline is the sign "NIGHT SHIFT": condensed sans (Avenir Next Condensed, Arial Narrow), 700, clamp(64px, 13vw, 168px), uppercase, letter-spacing .04em, two words wrapping into two lines.
- Lede "Beans roasted between midnight and dawn, on your doorstep before your alarm." 19px.
- One cyan pill button "Order this week's roast", background #55e6ff, dark text, glow 0 0 28px rgba(85,230,255,.55).
- Bottom left label "Open 22:00 to 06:00" in pink with a text glow. Bottom right a neon cup drawn as SVG strokes (cup body, handle, saucer line) in #55e6ff with drop-shadow glow, plus three steam curls rising and fading on a 3.4s loop, staggered by 1.1s.

## MOTION
- Build each letter as its own span. Off state color #3a1b24 with no glow. On state color #ffe3ee with text-shadow 0 0 6px #fff, 0 0 18px #ff4f8b, 0 0 42px #ff4f8b, 0 0 90px #ff4f8b.
- Ignition order 0,4,1,9,3,6,2,8,5,7. Each letter starts 170ms after the previous and steps through on/off pattern 1,0,1,0,0,1,0,1,1 at 55ms per step, a stop-motion stutter.
- Every third letter keeps a flicker afterwards: keyframes with steps(1) over 4.2s dropping to opacity .25 between 7% and 8.5%.
- Scroll: glow = lerp toward clamp(progress / 0.7). It raises the wall glow and draws the cup (stroke-dasharray 400, offset 400 - 400 * glow, opacity .25 to 1).
- Magnetic button: within 160px of its centre, translate it by (pointer delta * (1 - distance / 160) * 0.45), the label by a further 35% of that. Ease with transform .25s cubic-bezier(.2,.9,.3,1.2). Reset when the pointer leaves the radius.
${COMMON}`
},
{
  id:'quarry', name:'Quarry & Co', category:'Hero Section', tier:'Premium', isNew:true, hue:30, motion:'scrub',
  description:'An architecture studio that builds its own building in stop-motion: isometric stone blocks drop into place course by course as you scroll, with a crane swinging overhead and a frame counter ticking up.',
  prompt:`# Build prompt: Quarry & Co hero

## DIRECTION
An architecture studio that works in local stone. Warm concrete paper, charcoal type, one rust accent. The hero assembles a small stone building in stop-motion, one block per frame, as you scroll.

## LAYOUT
- body height 340vh. Sticky 100vh stage as a two-column grid (1fr 1.1fr, 6vw side padding), stacking to one column under 820px.
- Background #e4dfd6 with a 40px blueprint grid (1px lines at rgba(38,34,30,.05)).
- Left column: eyebrow pill "Quarry & Co Architects"; headline "We build in quiet stone." in Didot / Bodoni 72 / Georgia, 400, clamp(48px, 6.4vw, 96px), with "quiet" italic in rust #c4552d; lede "Civic buildings, homes and chapels shaped from local rock, set one course at a time."; buttons "See the work" (solid #26221e) and "Start a project" (outline).
- Right column: an SVG (viewBox 620x560) with the isometric scene. Bottom right a monospace counter "FRAME 07 / 34" with the current number in rust.

## ISOMETRIC SCENE
- Projection: screenX = 310 + (x - y) * cos(30deg) * 46, screenY = 330 + (x + y) * 0.5 * 46 - z * 46.
- Ground slab polygon from (-0.4, -0.4) to (3.4, 3.4) at z 0, fill #d2cbc0.
- Building: a 3 x 3 footprint, four courses (z 0 to 3). Leave out x1 y2 on courses 2 and 3 for a doorway, and x0 y0 on course 3. Add a capstone at x1 y1 z4. Blocks on course 2 at y2 (except the doorway) are rust.
- Each block is three polygons: top, left, right. Stone shades #cfc7bb, #b3a998, #958a79. Rust shades #d9744d, #c4552d, #9f4122. Stroke rgba(38,34,30,.25) at 0.8px.
- Draw in painter's order (z, then x + y, then x). Build in construction order (z, then x + y).
- A crane: a mast and jib path in #26221e with two diagonal braces, and a hook group (line plus small rust hook) swinging -5deg to 5deg with animation steps(8) over 2.4s, alternate.

## MOTION
- Hidden blocks have opacity 0. A block added with class "in" plays: translateY(-260px) to 8px to 0 over 0.5s with steps(5, end), so it drops like stop-motion, not a smooth tween.
- On load, lay the first course one block every 140ms. After that, scroll sets the visible count: firstCourse + (total - firstCourse) * min(1, progress / 0.85), rounded. Scrolling back removes blocks.
- Update the frame counter to the visible count, zero padded.
${COMMON}`
},
{
  id:'monsoon', name:'Monsoon', category:'Hero Section', tier:'Premium', isNew:true, hue:190, motion:'particles',
  description:'A weather app hero under a full canvas rainstorm, where your cursor is an umbrella that rain slides off, lightning flashes now and then, and scrolling eases the storm into a clear dawn.',
  prompt:`# Build prompt: Monsoon hero

## DIRECTION
A minute-by-minute rain forecast app. Night storm teal, white type, a mint accent. A real canvas rainstorm fills the screen, the pointer acts as an umbrella, and scrolling clears the weather into dawn.

## LAYOUT
- body height 320vh. Sticky 100vh stage, centred copy over a full-bleed <canvas> sized to the viewport at devicePixelRatio (max 2).
- Eyebrow pill with a glowing mint dot (#7fe3d0): "Monsoon Weather". Headline "Rain, forecast to the minute." 700, clamp(46px, 7.6vw, 112px), letter-spacing -0.035em. Lede "Street-level radar that tells you when the first drop lands and when the last one does." Buttons "Get the app" (solid light) and "See live radar" (outline on a dark translucent fill).
- Give the copy a soft text-shadow 0 2px 24px rgba(7,19,24,.45) so it stays readable on the bright dawn.
- Bottom centre a live meter: label, a 180px bar filled by intensity (gradient #7fe3d0 to #5aa9ff), and a value "14.2 mm/h". Labels: Heavy rain above 0.66, Easing off above 0.25, Last drops above 0.02, then "Clear by 06:40".

## CANVAS
- Sky gradient top to bottom, interpolated by clear (0 to 1): top rgb(10,30,38) to rgb(40,62,92), middle rgb(7,22,28) to rgb(150,88,92), bottom rgb(5,14,18) to rgb(214,140,104). Add a warm radial sun glow from below centre with alpha = clear.
- 520 drops with x, y, depth z (0 to 1) and sideways velocity vx. Speed (9 + 13z) * intensity per 16ms, wind -1.2. Draw each as a line of length (8 + 16z) * intensity, width 0.6 + 1.2z, colour rgba(200,236,240, (0.18 + 0.45z) * intensity), round caps.
- Umbrella: smooth the pointer with a 0.25 lerp. Any drop within 110px and above the pointer gets pushed sideways (vx += direction * k * 6, k = 1 - distance / 110) and slowed, with a small chance of a splash. Draw a mint arc (radius 90px, from 1.08 PI to 1.92 PI) at the pointer.
- Splashes are flat ellipses growing outward and fading. Drops reaching the bottom respawn above the top and sometimes splash on the ground line.
- Lightning: while intensity is above 0.6, every 3.8 to 6.8s flash a full-screen #dff4ff layer (mix-blend screen) with keyframes 0, .55, .05, .4, 0 over 520ms.

## SCROLL
- p eases toward scroll progress at 0.08 per frame. intensity = 1 - clamp((p - 0.45) / 0.45). clear = clamp((p - 0.5) / 0.45).
${COMMON}`
},
{
  id:'atlas-rail', name:'Atlas Rail', category:'Hero Section', tier:'Premium', isNew:true, hue:25, motion:'parallax',
  description:'A sleeper-train hero where scrolling drives the train across a sideways landscape of mountains, forests and stations, the light slides from morning to dusk, and the next station name updates as you travel.',
  prompt:`# Build prompt: Atlas Rail hero

## DIRECTION
A long-distance sleeper train company. Flat illustrated landscape in peach, mauve and pine, a red locomotive with blue carriages. Vertical scroll is turned into sideways travel, morning becomes dusk, and the route panel names each station you pass.

## LAYOUT
- body height 420vh. Sticky 100vh stage with overflow hidden.
- Sky: linear-gradient from --s1 (#f9c98f) to --s2 (#f6e3c4 at 70%). A sun disc 150px with a radial gradient #fff6dc to #ffcf7a, at left 72%, top 18% plus --sunY%.
- Three landscape layers, each 600vw wide and full height, holding an SVG with viewBox 0 0 6000 1000 and preserveAspectRatio none:
  - far: a jagged ridgeline path, fill #c9a2a6 at opacity .75 (base 560, amplitude 320, step 140).
  - mid: a ridgeline, fill #8f7393 (base 720, amplitude 240, step 90).
  - near: pine trees (trunk line #3b3550, triangle crown #4f6b4a) at pseudo random spacing, with an occasional small station house (yellow box, red roof, dark door).
  Generate each layer as a 3000 unit tile and draw it twice (the second copy offset by 3000) so it loops without a seam. Use a seeded pseudo random (r = (r * 9301 + 49297) % 233280) so the scene is identical on every load.
- Ground band at the bottom (15vh) and a rail line: a 3px solid line with dashed sleepers drawn by a repeating-linear-gradient.
- The train as one SVG (720x170 viewBox), centred slightly left: red locomotive #c4473a with dark cab and lit windows #ffd98a, a chimney, two blue carriages #2f5d7c with a mustard stripe and eight lit windows, the locomotive on the left so it leads, wheels with a spoke bar spinning anticlockwise (rotate -360deg over 0.5s, linear, infinite), and three steam puffs drifting back (to the right) and up (1.8s, staggered).
- Copy top left: eyebrow pill "Atlas Rail"; headline "Cross the continent by rail." in Futura / Avenir Next, 700, clamp(44px, 6.2vw, 92px); lede "Sleeper cabins, dining cars and eleven countries between breakfast and the coast."; buttons "Plan a journey" (solid #1d1a2e) and "See the routes" (outline).
- Top right route panel in monospace: "Now passing", a station name in large type, and a kilometre count.

## MOTION
- p eases toward scroll progress at 0.1 per frame. travel = p * 4800 + drift, where drift grows by 0.012px per ms so the train never fully stops.
- The train travels left, so the scenery moves right: translate each layer by ((travel * speed) modulo (innerWidth * 3)) minus innerWidth * 3, with speeds far 0.15, mid 0.4, near 1.0. Move the rail sleepers right at 1.6.
- k = min(1, p * 1.1). Interpolate sky top #f9c98f to #362c5c, sky bottom #f6e3c4 to #ec8062, ground #6d5a4f to #2d243a, and lower the sun by 58% of its range.
- Stations in order: Valdora, Kesselmark, Orvieno, Lindhaven, Port Saray, chosen by floor(p * 5). Kilometres = round(p * 2140).
${COMMON}`
}
];
