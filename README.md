# AI Practitioner Skills Framework v5.2

> A comprehensive, structured reference for core AI skills, sub-skills, and competencies — with unified LoRA technique integration.  
> Designed for learners, professionals, and AI agents.

**Live Site:** <https://marktantongco.github.io/aiskills-photog/>

---

## Table of Contents

- [Overview](#overview)
- [Framework Architecture](#framework-architecture)
- [Core Domains](#core-domains)
- [LoRA Ecosystem Blueprint](#lora-ecosystem-blueprint)
- [Skill Synergy Map](#skill-synergy-map)
- [Competency Progression](#competency-progression)
- [Website Walkthrough](#website-walkthrough)
- [File Inventory](#file-inventory)
- [Quick-Start Templates](#quick-start-templates)
- [Platform Reference](#platform-reference)
- [Technical Architecture](#technical-architecture)
- [Run Locally](#run-locally)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The **AI Practitioner Skills Framework** is a zero-build static site that serves as a comprehensive, agent-parsable reference for professional AI visual generation and fine-tuning. It covers **7 core domains**, **66 documented sub-skills**, copy-ready prompt templates, a live prompt builder with six-dimension heuristic scoring, optional LLM-powered critique, and a unified LoRA technique ecosystem.

### Key Principles

| Principle | Description |
|-----------|-------------|
| **Photorealistic Logic First** | Every generation operates within the laws of optics, anatomy, and spatial psychology |
| **Quiet Luxury of Execution** | Professional work reveals itself through restraint — precise control over maximum effect |
| **Intentional Architecture** | Structure prompts as you'd architect a building — load-bearing concepts first, decorative elements last |
| **Verification as Discipline** | Generation is the beginning, not the end — systematic quality gates separate professionals from enthusiasts |
| **Parameter-Efficient Mastery** | LoRA techniques enable targeted fine-tuning without the cost of full retraining |

---

## Framework Architecture

```
+--------------------------------------------------------------+
|                        FOUNDATION                             |
|   01 Technical Prompt Engineering + 02 Photographic Literacy  |
+-----------------------+------------------+-------------------+
                        |                  |
                        v                  v
+-------------------------------+  +-------------------------------+
|     CONSISTENCY LAYER         |  |     REFINEMENT LAYER          |
|  03 Strategic Negation &      |  |  05 Post-Processing &         |
|     Skin Mastery              |  |     Hybrid Workflows          |
|  04 Identity Preservation &   |  |                               |
|     Consistency               |  |                               |
+--------------+----------------+  +--------------+----------------+
               |                                  |
               v                                  v
+-------------------------------+  +-------------------------------+
|    OPTIMIZATION LAYER         |  |    ORCHESTRATION LAYER        |
|  07 LoRA Ecosystem &          |  |  06 AI Agent Orchestration    |
|     Parameter-Efficient       |  |                               |
|     Fine-Tuning               |  |                               |
+--------------+----------------+  +--------------+----------------+
               |                                  |
               v                                  v
+--------------------------------------------------------------+
|               PRODUCTION DEPLOYMENT & SCALING                 |
+--------------------------------------------------------------+
```

### Domain Summary

| # | Domain | Sub-skills | Focus Area |
|---|--------|-----------|------------|
| 01 | **Technical Prompt Engineering** | 10 | Structured prompt construction, vocabulary, syntax |
| 02 | **Photographic Literacy** | 12 | Lighting, optics, lens selection, cinematic grammar |
| 03 | **Strategic Negation & Skin Mastery** | 5 | Negative prompting, skin realism, anatomical correction |
| 04 | **Identity Preservation & Consistency** | 6 | Seed locking, references, character weight, VSA |
| 05 | **Post-Processing & Hybrid Workflows** | 11 | Inpainting, compositing, enhancement, deployment |
| 06 | **AI Agent Orchestration** | 10 | Architecture, routing, teams, sovereign infrastructure |
| 07 | **LoRA Ecosystem & PEFT** | 12 | LoRA, QLoRA, DoRA, AdaLoRA, rsLoRA, LoRA+, VeRA, GLoRA |

---

## Core Domains

### Domain 01 — Technical Prompt Engineering

*Constructing prompts as structured blueprints, not keyword lists.*

| Sub-Skill | Key Technique | Example |
|-----------|--------------|---------|
| Scaffold Method | `[Subject] + [Action] + [Lighting] + [Lens] + [Style] + [Quality]` | `A woman walking in rain + cinematic lighting + 85mm f/1.8 + photorealistic + 4K` |
| Information Priority | Front-load critical elements — AI weights early tokens | `Oil painting of a castle...` vs `A castle, oil painting...` |
| Photographic Vocabulary | Precise terms over vague buzzwords | `85mm lens, f/2.8, shallow depth of field` |
| Camera Movement | Cinematography in text | `pull from close-up to wide, dolly zoom` |
| Agent Patterns | Multi-step workflows | `Zero-shot, few-shot, chain-of-thought` |
| Advanced Prompt Syntax | Weighted syntax, conditional prompts | `(masterpiece:1.5), (best quality:1.3)` |
| Semantic Layering | Concept ordering for interpretation hierarchy | `[serious executive] [in shadows] [dramatic side lighting]` |
| Style Injection | Artistic references without overriding subject | `::0.3` after style reference |

### Domain 02 — Photographic Literacy

*Reconstructing real-world physics for believable, professional-grade results.*

| Sub-Skill | Key Technique | Example |
|-----------|--------------|---------|
| Lighting Patterns | Rembrandt, Butterfly, Rim, Split, Loop | `Rembrandt: key light 45° high, fill 1/4 power` |
| Lens Selection | Portrait (85-135mm), Standard (35-50mm), Wide (18-24mm) | `85mm portrait lens for flattering compression` |
| Optical Physics | Bokeh quality, anamorphic rendering, MTF charts | `shot on Leica 50mm Summilux, organic bokeh` |
| Aperture Control | f-stop for depth of field | `f/2.8 isolation; f/11 product sharpness` |
| Native Resolution | 720p (preview), 1080p (enhanced), 4K (pro) | `4K native for skin pores; avoid upscaling` |
| Anamorphic Mastery | Horizontal flares, elliptical bokeh, 2.39:1 | `Panavision Primo anamorphic, blue flares` |
| Cinematic Grammar | Shot-reverse-shot, 180° rule, match cuts | `Wide → medium → close-up reaction` |
| Executive Portraiture | Power poses, lighting hierarchy, spatial dominance | `CEO portrait, corner lighting, dark navy suit` |
| Quiet Luxury Aesthetic | Muted palettes, natural materials, no logos | `cream cashmere, matte gold, soft north light` |

### Domain 03 — Strategic Negation & Skin Mastery

*Telling the AI what NOT to include to overcome unnatural perfection.*

| Sub-Skill | Key Technique | Example |
|-----------|--------------|---------|
| Negative Prompting w/ Weights | `(unwanted:weight)` syntax | `(plastic skin:1.4), (extra fingers:1.4)` |
| Skin Realism | Prompt textures + negate artifacts | `visible pores, vellus hair \| negate: airbrushed, waxy` |
| Anatomical Correction | Target common AI errors proactively | `(fused fingers, double iris:1.4)` |
| Temporal Consistency | Prevent feature drift in video | `--cref character.jpg --cw 80 + error recycling` |
| Drift Correction | Feed artifacts back for stability | `Generate → identify → retrain → regenerate` |

### Domain 04 — Identity Preservation & Consistency

*Maintaining characters, styles, and narratives across generations.*

| Sub-Skill | Key Technique | Example |
|-----------|--------------|---------|
| Seed Locking | Fix noise pattern for controlled variations | `--seed 12345` |
| Reference Tools | Platform-specific reference systems | `--cref char.jpg --sref style.jpg --cw 80` |
| Character Weight | Fine-tune reference influence scope | `--cw 0` (face) to `100` (full) |
| Multi-Reference | Combine multiple references | `char1 + char2 + background + prop` |
| Agent-Based Consistency | Specialized agents for coherence | `DirectorAgent coordinates Veo + Midjourney` |
| Visual-Script Alignment | Score frames vs storyboard | `Flag >15% deviation for review` |

### Domain 05 — Post-Processing & Hybrid Workflows

*AI generation as the start, not the end.*

| Sub-Skill | Key Technique | Example |
|-----------|--------------|---------|
| Iterative Refinement | Seed-locked branching | `--seed 12345, weather: rainy → snowy` |
| Inpainting/Outpainting | Surgical edits or canvas expansion | `Fix hands via inpainting` |
| External AI Enhancement | Specialized finishing tools | `Topaz, Lightroom, Runway` |
| Unified Generation | Edit in same context | `Qwen Image 2.0, Gemini 2.5` |
| Cross-Domain Compositing | Blend different sources | `Illustrated into photoreal background` |
| Text Overlay | Typography during generation | `text: "LAUNCH 2026" bold serif` |
| Post-Generation Checklist | Systematic quality verification | ☐ Hands ☐ Eyes ☐ Lighting ☐ Resolution |

### Domain 06 — AI Agent Orchestration

*Multi-step autonomous workflows with collaborating AI agents.*

| Sub-Skill | Key Technique | Example |
|-----------|--------------|---------|
| Agent Architecture | LLM + tools + memory + plan/act/reflect | `search → summarize → generate → publish` |
| Router Pattern | Semantic routing to specialists | `route(intent) → specialist agent` |
| SLM Optimization | 1B-10B models for cost-effective tasks | `simple → SLM · complex → LLM` |
| Role-Based Teams | Planner, Researcher, Writer, Reviewer | `Planner → Researcher → Writer → Reviewer` |
| Cross-Agent Communication | Structured protocols | `agent.send(task, context, constraints)` |
| Private Skill Deployment | SKILL.md packages | `SKILL.md = purpose + workflow + validation` |
| Auditable Workflows | Track every action | `log(agent, action, input, output, ts)` |
| Sovereign Infrastructure | Private deployment | `self-hosted vLLM, data stays in VPC` |

### Domain 07 — LoRA Ecosystem & Parameter-Efficient Fine-Tuning *(New v5.0)*

*Unified reference for Low-Rank Adaptation techniques and their applications in AI visual generation.*

> **Why LoRA matters for AI practitioners:** LoRA enables you to customize foundation models (Stable Diffusion, FLUX, video models) for specific styles, subjects, or workflows — without retraining the entire model. It's the bridge between prompt engineering and full model ownership.

| Technique | Memory Reduction | Key Innovation | Best For |
|-----------|-----------------|----------------|----------|
| **LoRA** | ~60-80% fewer trainable params | Low-rank decomposition W = W₀ + BA | General fine-tuning, style transfer, subject learning |
| **QLoRA** | ~75% (4-bit quantization + LoRA) | NF4 quantization on frozen weights | Consumer GPU fine-tuning, 7B-70B models on single GPU |
| **DoRA** | ~70% (comparable to LoRA) | Decompose into magnitude + direction | Higher fidelity style preservation, detail-sensitive work |
| **AdaLoRA** | ~70% | Adaptive rank allocation per layer | Budget-constrained training, automatic importance scoring |
| **rsLoRA** | ~60% (rank-stabilized) | Rescaled gradient stabilization | High-rank adaptation, closer to full fine-tuning quality |
| **LoRA+** | ~60% | Differential learning rates for A/B matrices | Faster convergence, better optimization dynamics |
| **VeRA** | ~90%+ | Shared frozen random matrices + per-layer scaling | Extreme parameter efficiency, multi-tenant serving |
| **GLoRA** | ~75% | Global prompt + per-layer adapter | Multi-task adaptation, task-conditioned generation |
| **LongLoRA** | ~60% | Sparse local attention + LoRA | Extending context windows affordably |
| **S-LoRA** | Serving optimization | Unified paging + tensor parallelism | Serving 1000s of LoRA adapters on one GPU |
| **LoRA-FA** | ~70% | Frozen A matrix, only train B | Further memory reduction with minimal quality loss |
| **Tied-LoRA** | ~80% | Weight tying across adapter layers | Maximum parameter efficiency |

#### LoRA Selection Decision Tree

```
Need to fine-tune a model?
│
├── Consumer GPU (< 24GB VRAM)?
│   ├── QLoRA (4-bit base + LoRA adapters)
│   └── LoRA-FA (frozen A matrix for extra savings)
│
├── Server GPU (24-80GB VRAM)?
│   ├── LoRA (standard approach)
│   ├── DoRA (higher fidelity needed)
│   └── rsLoRA (rank-stabilized for complex tasks)
│
├── Budget-constrained / auto-scaling?
│   ├── AdaLoRA (adaptive rank allocation)
│   └── VeRA (shared random matrices)
│
├── Multi-task / style library?
│   ├── GLoRA (global prompt conditioning)
│   └── S-LoRA (thousands of adapters, one GPU)
│
└── Extending context?
    └── LongLoRA (sparse attention + LoRA)
```

#### LoRA in Practice (ComfyUI / Diffusers)

```python
# Standard LoRA loading in ComfyUI
# Node: Load LoRA → set strength 0.6-1.0
# Source: CivitAI, HuggingFace, or self-trained

# Diffusers (Python)
from diffusers import StableDiffusionPipeline
pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0")
pipe.load_lora_weights("path/to/your-adapter.safetensors", adapter_name="my_style")
pipe.set_adapters(["my_style"], adapter_weights=[0.8])
image = pipe("A portrait in my custom style", num_inference_steps=30).images[0]

# Training a LoRA (simplified)
from peft import LoraConfig, get_peft_model
config = LoraConfig(
    r=16,                    # rank: 8-64 typical
    lora_alpha=32,           # scaling factor (2× rank common)
    target_modules=["to_q", "to_k", "to_v", "to_out.0"],
    lora_dropout=0.05,
    bias="none",
)
model = get_peft_model(base_model, config)
# model.print_trainable_parameters()
# trainable params: 1,966,082 || all params: 1,966,082 || trainable%: 0.15%
```

#### LoRA × Framework Integration

| Framework Domain | LoRA Application |
|-----------------|------------------|
| **Prompt Engineering** | LoRA replaces vague style keywords with learned visual patterns |
| **Photographic Literacy** | Train LoRAs on specific lighting setups, lens characteristics, film stocks |
| **Strategic Negation** | Fine-tune to inherently avoid artifacts (reduces need for negative prompts) |
| **Identity Preservation** | Character LoRAs for consistent identity across unlimited generations |
| **Post-Processing** | LoRA adapters as modular components in multi-stage pipelines |
| **Agent Orchestration** | Dynamic LoRA loading per task via S-LoRA serving infrastructure |

---

## Skill Synergy Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        FOUNDATION                                │
│   Prompt Engineering (01)  ◄──►  Photographic Literacy (02)     │
└───────────┬─────────────────────────────────────┬───────────────┘
            │                                     │
            ▼                                     ▼
┌──────────────────────────┐       ┌──────────────────────────────┐
│    CONSISTENCY LAYER     │       │     REFINEMENT LAYER         │
│  Strategic Negation (03) │       │  Post-Processing (05)        │
│  Identity Preserv. (04)  │       │  Hybrid Workflows            │
└───────────┬──────────────┘       └──────────────┬───────────────┘
            │                                     │
            ▼                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              OPTIMIZATION LAYER                                  │
│         LoRA Ecosystem & PEFT (07)                               │
│    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│    │ LoRA     │ │ QLoRA    │ │ DoRA     │ │ AdaLoRA  │         │
│    └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              ORCHESTRATION LAYER                                 │
│         AI Agent Orchestration (06)                              │
│    Router → Teams → Deploy → Monitor → Scale                     │
└─────────────────────────────────────────────────────────────────┘
```

**Key Insight:** Skills compound. Foundation enables consistency; consistency enables refinement; refinement is optimized through LoRA techniques; optimization enables scalable agent orchestration.

---

## Competency Progression

| Level | Domains | Key Capabilities | Typical Tools | Success Metric |
|-------|---------|-----------------|---------------|---------------|
| **🟢 Beginner** | 01, 02 (basic) | Natural language prompts, basic navigation, simple generation | DALL·E 3, Gemini, ChatGPT, Midjourney | Generates coherent images from simple prompts |
| **🟡 Intermediate** | 01-04 (basic) | Technical vocabulary, lighting/lens control, negation, seed locking | Midjourney, SDXL, Leonardo, basic ComfyUI | Consistent on-brand outputs, fixes common artifacts |
| **🟠 Advanced** | 01-06 + LoRA basics | Reference control, inpainting, multi-tool, video, LoRA loading | ComfyUI, ControlNet, Topaz, LoRA adapters | 10+ consistent generations, multi-scene narratives |
| **🔴 Expert** | 01-07 (full) | Agent design, LoRA training, production deployment, sovereign infra | LangChain, PEFT, vLLM, S-LoRA, K8s | Ships auditable, scalable AI systems |

---

## Website Walkthrough

### Interactive Features

| Feature | Description | How to Use |
|---------|-------------|------------|
| **Light/Dark Theme** | Honors system preference, persists choice, no FOUC | Click 🌙/☀️ toggle in nav |
| **Live Search** | Filter all skill cards across all sections | Press <kbd>/</kbd> to focus, type to filter |
| **Copy-Ready Examples** | Click any code chip to copy | Click or keyboard-activate any `.card-code` |
| **Prompt Builder** | Live demo with six-dimension scoring, notes, save/reset, and randomize | Section 10 — select values, watch score update |
| **AI Critique** | Optional Gemini-powered prompt analysis | Paste a free API key in the drawer, click "Run AI Critique" |
| **Copy Score Report** | Export structured scoring as text | Click 📋 Copy report next to the score badge |
| **Deep-Linkable Sections** | Hash anchors with header-offset scrolling | Share URLs like `#prompt`, `#lora`, `#matrix` |
| **Keyboard Shortcuts** | `/` or `Ctrl/Cmd + K` for search, `Esc` to close | Works globally, even in mobile menu |

### Section Navigation

| # | Section | ID | Content |
|---|---------|-----|---------|
| 00 | Synergy Map | `#synergy` | Skill connection flow + SVG schematic + Mermaid source |
| 01 | Prompt Engineering | `#prompt` | 6 highlighted sub-skills with copy-ready examples |
| 02 | Photographic Literacy | `#photo` | 6 highlighted sub-skills |
| 03 | Strategic Negation | `#negation` | 5 highlighted sub-skills |
| 04 | Identity & Consistency | `#identity` | 6 highlighted sub-skills |
| 05 | Post-Processing | `#postprocess` | 6 highlighted sub-skills |
| 06 | Agent Orchestration | `#agent` | 8 highlighted sub-skills |
| 07 | LoRA & PEFT | `#lora` | 8 highlighted sub-skills |
| 08 | Competency Progression | `#progression` | 4-level advancement path |
| 09 | Skill Matrix | `#matrix` | 7×4 competency grid |
| 10 | Prompt Builder Demo | `#demo` | Interactive scaffold + notes + scoring + AI critique |
| 11 | Templates | `#templates` | Image, Video, Agent SKILL.md templates |

---

## File Inventory

```
aiskills-photog/
├── index.html              # Main SPA — semantic HTML5, theme + builder + scoring
├── script.js               # Interaction layer — IIFE, defensive + a11y-first
├── styles.css              # Design system — tokens, themes, print, reduced-motion
├── SKILL.md                # Single source of truth — 7 domains, 66 documented sub-skills
├── api/
│   └── critique.py         # Optional serverless Gemini proxy (stdlib only)
├── requirements.txt        # Empty by design — the handler uses only stdlib
├── docs/
│   ├── plans/
│   │   └── 2026-08-24-v4-upgrade.md
│   └── reports/
│       ├── 2026-08-25-v5-research.md
│       └── 2026-08-27-v5.1-audit.md
├── tools/
│   ├── build-pdf.py        # skills.pdf generator — derives version from SKILL.md
│   ├── build-wiki.py       # wiki.html generator — derives version/counts from SKILL.md
│   ├── session-restore.sh  # self-heal + release gates G1–G15
│   ├── test-critique.js    # jsdom regression test for critique transport
│   └── test-site.js        # jsdom smoke test for builder/search/theme/menu
├── docs/ci/
│   └── gates.yml           # Release-gate CI — copy to .github/workflows/ to enable
├── wiki.html               # GENERATED — rebuild with tools/build-wiki.py
├── skills.pdf              # GENERATED — rebuild with tools/build-pdf.py
├── skills-sh-mockup.html   # Interactive CLI mockup
├── README.md               # This file
└── .gitignore              # .DS_Store, node_modules/, __pycache__/, .env, .env.*
```

> `wiki.html` and `skills.pdf` are build outputs, not sources — v5.0 shipped both with a
> dropped domain because their generators hard-coded a `<= 6` section filter and literal
> version strings. Counts and versions are now derived from `SKILL.md` at build time; enable
> `docs/ci/gates.yml` and CI additionally fails if a fresh build differs from the committed
> `wiki.html`.


### Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│  VISITOR BROWSER                                     │
│                                                      │
│  index.html ── loads styles.css ── loads script.js   │
│       │                        (IIFE, 10 modules)   │
│       │                                              │
│  ┌────┴──────────────────────────────────────┐       │
│  │  script.js Modules:                        │       │
│  │   1. Theme (system + toggle)               │       │
│  │   2. Mobile nav (hamburger + focus trap)   │       │
│  │   3. Scroll progress + back-to-top         │       │
│  │   4. IntersectionObserver reveals          │       │
│  │   5. Section spy (nav highlighting)        │       │
│  │   6. Hash deep-linking                     │       │
│  │   7. Live search + highlighting            │       │
│  │   8. Copy-to-clipboard                     │       │
│  │   9. Keyboard shortcuts (/ , Esc)          │       │
│  │  10. Scaffold Builder + Scoring + Critique │       │
│  └───────────────────────────────────────────┘       │
│                                                      │
│  Gemini Critique (optional):                         │
│    Prod: fetch(api/critique) → declared proxy        │
│    Dev:  fetch(googleapis.com + x-goog-api-key)      │
│    Fallback: heuristic message                       │
└─────────────────────────────────────────────────────┘
```

---

## Quick-Start Templates

### Image Generation
```
[Subject] + [Action] + [Lighting] + [Lens] + [Style] + [Quality] + [Negatives]

"Professional headshot, smiling naturally, Rembrandt lighting with key
light 45° high, 85mm lens f/2.8, photorealistic, 4K native,
(plastic skin:1.3) (airbrushed:1.2)"
```

### Cinematic Video
```
[Scene] + [Camera] + [Lighting] + [Technical] + [Continuity] + [Negatives]

"Protagonist discovers clue in dim library, slow dolly zoom from
wide to close-up, golden hour backlight, 24fps 4K, --cref char.jpg,
(facial drift:1.4)"
```

### LoRA Training Template
```yaml
# LoRA Training Configuration
base_model: "stabilityai/stable-diffusion-xl-base-1.0"
method: QLoRA                    # Consumer GPU friendly
rank: 16                         # 8-64 typical
lora_alpha: 32                   # 2× rank common
target_modules:                  # Attention layers
  - to_q, to_k, to_v, to_out.0
learning_rate: 1e-4
num_epochs: 10-20
batch_size: 4-8
resolution: 1024                 # Match model native
trigger_word: "my_style"         # For activation
dataset: 20-50 curated images    # Quality > quantity
```

### Agent Task SKILL.md
```markdown
## Task: [Name]
**Roles**: Planner → Researcher → Writer → Reviewer
**Tools**: [web search, LLM, formatter]
**Validation**: [criteria]
**Format**: [markdown]
**Fallback**: [protocol]
```

---

## Platform Reference

| Category | Tools | Best For | Learning Path |
|----------|-------|----------|--------------|
| **Foundation Image** | Midjourney, SDXL, DALL·E 3 | Prototyping, learning | Scaffold + negation |
| **Pro Image** | Flux, Ideogram, Recraft, Qwen | Commercial, text rendering | References + multi-ref |
| **Video** | Veo 3.1, Wan 2.6, Sora, Runway | Cinematic, social | Camera movement + consistency |
| **LoRA Training** | PEFT, Diffusers, ComfyUI, OneTrainer | Custom adapters | LoRA → QLoRA → DoRA |
| **LoRA Serving** | S-LoRA, ComfyUI, CivitAI | Multi-adapter deployment | Dynamic loading + batching |
| **Hybrid Editing** | Photoshop, ComfyUI, Topaz | Refinement, compositing | Inpaint + upscale |
| **Agent Frameworks** | LangChain, AutoGen, CrewAI | Automation, teams | Router + auditable |
| **Deployment** | vLLM, TensorRT, GGUF, K8s | Production serving | Quantize + monitor |

---

## Technical Architecture

### Performance Budget

| Metric | Target | Implementation |
|--------|--------|---------------|
| First Paint | < 1s | FOUC-safe theme bootstrap, external cached fonts |
| Content Visibility | Off-screen sections lazy-rendered | `content-visibility: auto` on sections |
| Scroll Handler | Single rAF-throttled listener | No layout thrash, passive events |
| Accessibility | WCAG-AA contrast | Skip link, focus management, `aria-*` states |
| Print | Clean output | `@media print` hides nav, scores, builder |

### SEO & GEO

| Tag | Implementation |
|-----|---------------|
| JSON-LD | `TechArticle` schema with `hasPart` for all 6+1 domains |
| OpenGraph | `og:title`, `og:description`, `og:url`, `og:type` |
| Twitter Card | `summary` with title + description |
| GEO Declaration | `<meta name="ai-content-declaration" content="human-authored">` |
| Canonical URL | `https://marktantongco.github.io/aiskills-photog/` |

---

## Run Locally

```bash
# Any static server
python3 -m http.server 8080
# or
npx serve .
# or
bunx serve .
```

For a deployed AI Critique proxy, set the server-only `GOOGLE_API_KEY` env var; on the static site, paste a browser-scoped key in the drawer for direct Gemini requests.

---

## Contributing

Skill additions follow the format defined in [`SKILL.md`](SKILL.md):
- **Name** — clear, descriptive title
- **Purpose** — one-sentence goal
- **Workflow** — numbered steps
- **Validation** — success criteria
- **Connections** — links to other skills

LoRA-related contributions should include:
- Technique name and variant family
- Memory/compute characteristics
- Platform compatibility (ComfyUI, Diffusers, etc.)
- Training configuration recommendations

---

## Release history

| Version | Tag | What shipped |
|---|---|---|
| **v5.2** | *(working release)* | Accessibility pass, search/URL fixes, persistent prompt builder, six-dimension scoring, safer critique transport, and source-count integrity |
| **v5.1** | `v5.1` | Artifact-pipeline fix + critique transport fix + gate script and CI |
| v5.0 | *(never tagged)* | LoRA Domain 07, `skills.md` folded into `SKILL.md`, SEO/GEO pass, prompt-score panel, optional Gemini critique drawer |
| v4.0 | `v4.0` | Search highlighting, scaffold-builder demo, skill matrix, SVG schematic, print wiki, `skills.pdf` |

### v5.2 — what changed and why

1. **The page is now internally consistent.** The live page, structured data, source document, print wiki, and PDF advertise one release marker and the audited count of 66 documented table rows across 7 domains. The competency matrix now includes LoRA, and the navigation includes the builder.
2. **Navigation and accessibility were hardened.** Semantic copy buttons replace non-interactive spans, deep links work on initial load and browser back/forward, the mobile menu manages focus and inert content, and active-section state is calculated reliably for tall sections.
3. **Search became a real discovery tool.** Category-heading matches preserve the relevant section, matches are announced in a visible feedback bar, empty results get recovery guidance, and both `/` and `Ctrl/Cmd + K` focus search.
4. **The prompt builder is stateful and more useful.** Optional intent/constraint notes, reset/randomize/copy controls, local restoration, character count, accessible meters, six-dimension scoring, and actionable recommendations are available without a network request.
5. **Critique transport is safer and more resilient.** Browser-key requests use the `x-goog-api-key` header instead of a URL query, requests time out and de-duplicate stale results, the proxy validates input and redacts upstream errors, and the offline scorer remains the default.

### v5.1 — what changed and why

1. **`wiki.html` and `skills.pdf` were missing Domain 07 entirely.** Both generators
   filtered sections with a hard-coded `1 <= n <= 6`, so the LoRA domain that *was*
   v5.0's headline feature never reached the print wiki or the PDF — while
   `wiki.html`'s own header still claimed `6 domains · 64 sub-skills` next to
   SKILL.md's `7 Domains · 66 Sub-skills`. Both tools now derive the ceiling from
   SKILL.md and the build aborts on a mismatch.
2. **Generated artifacts stopped hard-coding their version.** `skills.pdf` shipped for
   two releases advertising `v3.1`, and `tools/build-pdf.py` still linked to
   `skills.md`, deleted in v5.0. Version, date, and counts are read from the
   `SKILL.md` marker at build time.
3. **The AI Critique drawer no longer probes a path this host cannot serve.** It
   inferred "production" from `location.protocol === 'https:'`, which is true on
   GitHub Pages, so every click POSTed to `/api/critique` — a root-absolute path that
   escapes `/aiskills-photog/`, 404s, then retried Google with `key=null`. Capability
   is now *declared* via `<meta name="critique-proxy">`, resolved relative to the page,
   and a dead proxy is remembered for the session. Without a key you get a clear
   message instead of an HTTP 400, and key storage goes through the existing
   throw-safe `store` helper (raw `localStorage.setItem` throws in Safari private mode).
4. **`tools/session-restore.sh` + `docs/ci/gates.yml`** — the release gates are now
   executable instead of tribal knowledge, including an unshallow step: in a depth-1 clone
   `git merge-base` / `--is-ancestor` silently lie, which is how a stale branch can look
   publishable. The workflow ships under `docs/ci/` because a GitHub App without the
   `workflows` scope cannot push to `.github/workflows/` — one `git mv` enables it.

Rebuild the artifacts whenever `SKILL.md` changes (do not hand-edit them):

```bash
python3 tools/build-wiki.py                                # wiki.html
python3 -m venv .venv && .venv/bin/pip install fpdf2 && .venv/bin/python tools/build-pdf.py   # skills.pdf
node tools/test-critique.js          # after: npm install jsdom --no-save
node tools/test-site.js               # builder/search/theme/menu smoke checks
python3 tools/test-critique-api.py     # server proxy validation (no network)
bash tools/session-restore.sh                              # all gates (incl. the above)
```

---

## License

**CC-BY-SA 4.0** — Share, adapt, and contribute improvements back to the community.

*AI Practitioner Skills Framework v5.2 · August 27, 2026*<br>
*7 Domains · 66 Documented Sub-skills · Unified LoRA Integration*
