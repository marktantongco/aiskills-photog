# AI Practitioner Skills Framework

A comprehensive, structured reference for core AI visual-generation skills -- prompt engineering, photographic literacy, strategic negation, identity consistency, post-processing, and agent orchestration. Designed for learners, professionals, and AI agents.

**Live:** <https://marktantongco.github.io/aiskills-photog/>

## Contents

| File | Purpose |
|------|---------|
| `index.html` | Main one-page site (semantic HTML5, light/dark themes, live search, copy-ready templates, prompt builder with scoring) |
| `styles.css` | Design system -- tokens, themes, responsive layout, a11y, print, reduced-motion support |
| `script.js` | Interaction layer -- theme, nav spy, reveal-on-scroll, clipboard, search/filter, scaffold builder, heuristic scoring, AI critique |
| `SKILL.md` | Single source of truth: full framework document (6 domains, 64 sub-skills, templates, platform reference, agent-parsable format) |
| `api/critique.py` | Serverless Gemini proxy (keeps API key server-side in production) |
| `skills-sh-mockup.html` | Interactive CLI mockup for a skills.sh integration |
| `wiki.html` | Print-friendly wiki view |

## Features

- **Light/dark theme** -- honors `prefers-color-scheme`, persists choice, no flash-of-wrong-theme
- **Live search** -- filter every skill card across all sections; press <kbd>/</kbd> to focus
- **Copy-ready examples** -- click or keyboard-activate any code chip; works on non-HTTPS via fallback
- **Prompt Scaffold Builder** -- live demo with 5-dimension heuristic scoring and optional Gemini AI critique
- **JSON-LD structured data** -- schema.org TechArticle markup for SEO and generative engine optimization
- **Accessibility-first** -- skip link, focus management, `aria-*` states, WCAG-AA contrast, reduced-motion support
- **Performance** -- external cached assets, `content-visibility` for off-screen sections, single rAF-throttled scroll handler
- **Deep-linkable** -- section anchors update the URL hash with header-offset scrolling

## Run locally

```bash
# any static server, e.g.
python3 -m http.server 8080
# or
npx serve .
```

## Contribute

Skill additions follow the SKILL.md format defined in [`SKILL.md`](SKILL.md) -- name, purpose, workflow, validation, connections.

License: CC-BY-SA 4.0
