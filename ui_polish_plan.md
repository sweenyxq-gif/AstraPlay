# Modern Cinema-Grade UI Architecture & End-to-End Polish

dj requested a complete UI overhaul across every surface to eliminate template/AI-generated feel and replace it with a bespoke, handcrafted cinema streaming experience.

## Proposed Upgrades

### 1. Visual Foundation & Typography System (`app/globals.css`)
- **Modern Typography**: Inter / Plus Jakarta Sans font stack with high-impact serif titles, crisp weights, micro-tracked uppercase kickers, and tabular numerals.
- **Glassmorphism & Depth**: Multi-layer dark surfaces (`#07080a`, `#0e1015`, `#161920`, `#20242e`), subtle 1px border highlights (`rgb(255 255 255 / 8%)`), backdrop blur for headers, dialogs, floating overlays, and ambient glows.
- **Micro-Interactions**: Smooth scale transforms on hover, gradient shimmer placeholders during catalog fetching instead of spinner text, active border highlights on stream cards.

### 2. Header & Navigation (`components/streaming-app.tsx` & `components/brand-mark.tsx`)
- **Brand Identity**: Premium custom geometric cinema badge with amber/gold accent and glowing pulse indicator.
- **Desktop Navigation**: Active indicator pill with subtle backdrop glow, quick search hotkey indicator (`Ctrl+K` / `⌘K`), direct access to live installed addon count.
- **Mobile Navigation**: Bottom floating glass dock with haptic-styled icon highlights and indicator dots for active routes.

### 3. Hero & Content Rails (`HomeView`)
- **Hero Presentation**: Edge-to-edge backdrop with multi-stop radial fade, live IMDB gold badge, high-contrast rating, runtime, and curated genre capsules.
- **Rail Carousels**: Native smooth horizontal scrolling with floating Left/Right rail navigation arrow buttons that appear on hover.
- **Card Design**: Subtle zoom effect, poster drop-shadow, progress bar overlay with smooth gradients.

### 4. Details View (`StremioDetailsView`)
- **Immersive Header**: Wide cinema billboard with floating poster art, metadata chip stack, quick watchlist toggle, and full cast/director list if present.
- **Season & Episode Picker**: Horizontal season pill switcher and rich episode cards showing episode title, air date, overview, and 16:9 thumbnail preview.
- **Source Picker Modal**: Segmented list grouped by Quality (4K, 1080p, 720p), showing file size, audio specs, source addon branding, and direct Play action.

### 5. Universal Video Player (`RemoteWatchView`)
- **Cinema Theater Controls**: Auto-hiding control bar on idle mouse (3s timeout), keyboard shortcuts (Space for pause, Left/Right arrows for 10s skip, F for fullscreen, M for mute).
- **Interactive Scrubber**: Hover preview timestamp bubble, buffered range indicator, smooth seek slider.
- **Subtitles & Audio**: Floating popover for subtitles selection with clear active indicator.

### 6. Addon Ecosystem & Store (`AddonsView`)
- **Preset Grid**: Sleek cards with addon badges, capability tags, live version status, and 1-click install/uninstall buttons.
- **Custom Addon Input**: Clean input bar with automatic URL validation, instant protocol conversion (`stremio://` -> `https://`), and feedback toast.

## Verification Plan
1. Build check: `npx tsc --noEmit` and `npm run build`.
2. Component regression check: Run `npm test`.
3. Test locally in browser on `http://127.0.0.1:8787`.
