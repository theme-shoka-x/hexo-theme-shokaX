# Copilot instructions for `hexo-theme-shokaX`

## Big picture
- This repo is a **Hexo theme**. Runtime theme logic lives in `scripts/` (Hexo auto-loads `scripts/**/*.js`).
- Templates are Pug in `layout/**/*.pug`; styles are Stylus in `source/css/**/*.styl`; browser code is in `source/js/_app/**`.

## Key flows (read these before refactors)
- **Browser bundle at generate-time:** `scripts/generaters/script.ts` uses **esbuild** during `hexo generate` to bundle the entry `source/js/_app/pjax/siteInit.ts` (prefers `themes/shokaX/...`, falls back to `node_modules/hexo-theme-shokax/...`). It returns virtual output files under `${theme.js}` / `${theme.css}` and injects config via `define` (`shokax_CONFIG`, plus flags like `__shokax_waline__`).
- **Theme injection system:** `scripts/plugin/lib/injects.ts` runs `hexo.execFilterSync('theme_inject', injects)` and exposes view/style injection points defined in `scripts/plugin/lib/injects-point.ts`. Templates call `!= shokax_inject('head'|'sidebar'|...)` (e.g. `layout/_partials/layout.pug`, `layout/_partials/footer.pug`).
- **Config + data merging:** `scripts/generaters/config.ts` deep-merges `hexo.config.theme_config` into `hexo.theme.config`, merges language overrides from `source/_data` (`locals.data.languages`), and wires user override Stylus files `source/_data/{iconfont,colors,custom}.styl`.

## Project-specific conventions
- Prefer helpers over inline HTML:
  - Asset tags: `scripts/helpers/asset.ts` provides `_css(...)`, `_js(...)`, `vendor_js(...)`, `_vendor_font()`.
  - CDN/local vendor resolution: `scripts/utils.ts#getVendorLink()` (supports local vs CDN + SRI).
- `scripts/filters/post.ts` injects `loading="lazy"` on post images at `after_post_render`.

## Developer workflows (Windows-friendly)
- Package manager: **pnpm** (`packageManager: pnpm@10.x`), Node **>= 20** (`package.json#engines`).
- Typecheck: `pnpm test` (runs `tsc --build --verbose`; root `tsconfig.json` references `./source` and `./scripts`).
- ⚠️ **Do not casually run `pnpm build`:** it runs `toolbox/compiler.mjs`, which compiles `scripts/**/*.ts` to CJS **and then deletes the TS/JSON sources**. Only run for packaging/release on a clean working tree.
- Dependency “hoist” helper for Hexo sites: `toolbox/hoistdep.mjs` fetches the latest theme deps from npm mirror and installs them into the detected Hexo root.

## Runtime/environment constraints (don’t break these silently)
- `scripts/plugin/check.ts` enforces environment expectations and can stop generation (e.g. `hexo.config.syntax_highlighter` must be off; renderer deps like `hexo-renderer-aether`, `shokax-uikit`, `nyx-player` must exist; Node must be >= 20).

## External integrations to treat carefully
- Summary AI: `scripts/generaters/summary_ai.ts` calls `theme.config.summary.apiUrl` with `apiKey` and writes/updates `summary.json` in the site root. Never commit real keys; if adding config/examples, use placeholders.
- Comments/search feature flags are wired via esbuild `define` in `scripts/generaters/script.ts` (waline/twikoo/algolia/pagefind, etc.).
