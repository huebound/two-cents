Hero Decorative Assets – Standard Pattern

Overview

- All decorative images use a single transform utility: the `hero-nudge` class in `app/globals.css`.
- You control each image with four CSS variables on the element: `--tx`, `--ty`, `--rot`, `--sc`.
- Coarse placement (where it lives) is done with `top/left/right/bottom` in percentages relative to its container.
- Fine placement is done with the variables (pixels) so art direction stays precise.

CSS Utility

- Defined at `app/globals.css:102`.
- Transform: `translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(var(--sc))`.
- Defaults: `--tx: 0px; --ty: 0px; --rot: 0deg; --sc: 1`.
- Transform origin: bottom center (so items on a baseline scale in place). Override with inline `style={{ transformOrigin: 'center' }}` where needed (e.g., star).

Quick Recipe

1) Add your image and give it `hero-nudge absolute pointer-events-none`.
2) Anchor with percent: `top: '12%', left: '68%'` or pin to an edge with utility classes (`right-0`, negative margins to cancel padding).
3) Nudge precisely with variables: `style={{ '--tx': '-8px', '--ty': '6px', '--rot': '5deg', '--sc': '1.1' }}`.

Component Helper (optional)

- `components/NudgeImg.tsx` wraps the pattern so you can pass props instead of raw styles.
- Props: `top/left/right/bottom` (number or string), `tx/ty/rot/sc`, `width`, plus `className`.
- Example:

```tsx
<NudgeImg
  src="/images/2C-Landing-Assets/penny.png"
  className="z-10 w-[120px] sm:w-[128px] lg:w-[152px]"
  top="10%"
  left="8%"
  rot="12deg"
  sc={1}
  style={{ filter: 'drop-shadow(0 18px 32px rgba(0,0,0,0.18))' }}
/>
```

Attachment Patterns

- Pinned to viewport right: Wrap in a `div` with `absolute right-0 -mr-6 sm:block lg:-mr-12` and set a `width: clamp(...)`. Place dependents (e.g., the star) inside this wrapper so they move together. See `app/page.tsx:311`.
- Pinned to viewport left: Use `absolute left-0` with a small negative margin to cancel container padding, then nudge with variables. See `app/page.tsx:300` for the paper clip.
- Baseline row: Use a flex row with `items-end` to share a baseline; give each image `hero-nudge` and use `--sc`/`--tx`/`--ty` for optical alignment. See `app/page.tsx:224`.

Sizing Guidelines

- Prefer `width: clamp(min, vw, max)` to avoid pixelation. Example paper width: `clamp(260px, 30vw, 520px)`.
- Keep assets at or below their native resolution.

Adding a New Asset

1) Decide the container: baseline row, artboard column, pinned edge, or inside another asset wrapper (to follow it).
2) Place the `img` (or `NudgeImg`) with a percent anchor (`top/left`) relative to that container.
3) Nudge with `--tx/--ty/--rot/--sc` until it’s perfect.
4) For items that should follow another asset, nest them in that asset’s wrapper.

Notes

- Keep `pointer-events: none` on decorative images to preserve interactivity.
- If a scaled item feels like it floats off its “feet,” consider changing `transform-origin` to `center` or `bottom left` to taste.

