# AI Practitioner Skills Framework — Photographic & LoRA Wiki

> A comprehensive, research-backed reference for fusing **LoRA (Low-Rank Adaptation)** prompting with the framework's **photographic embodiment scaffold** (Subject → Lighting → Lens → Quality). Built for learners, working creators, and AI agents.

*Framework v3.0 · February 2026 · License: CC-BY-SA 4.0*

---

## Table of Contents

1. [Overview](#1-overview)
2. [Photographic Embodiment Scaffold](#2-photographic-embodiment-scaffold)
3. [LoRA Feature (Research-Backed)](#3-lora-feature-research-backed)
4. [LoRA + Photography Embodiment Prompt Structure](#4-lora--photography-embodiment-prompt-structure)
5. [Live LoRA Studio (Web App)](#5-live-lora-studio-web-app)
6. [Copy-Paste Templates](#6-copy-paste-templates)
7. [Running Locally](#7-running-locally)
8. [References](#8-references)

---

## 1. Overview

The AI Practitioner Skills Framework treats image generation as a **professional engineering discipline**: physics-informed, quality-gated, and continuously improvable. Skills compound across three layers:

```
FOUNDATION  →  Technical Prompt Engineering + Photographic Literacy
CONSISTENCY →  Strategic Negation + Identity & Consistency
REFINEMENT  →  Post-Processing & Hybrid Workflows
ORCHESTRATION → AI Agent Design + Production Deploy
```

This wiki focuses on the two features most relevant to realistic, on-brand output:

- **Photographic Embodiment** — the structured way we describe a shot so the model "photographs" rather than "draws."
- **LoRA** — lightweight, reusable trained weights that inject a specific *style*, *character*, or *concept* without retraining the base model.

The key idea (and the contribution of this project): **don't tack LoRA tags onto the end of a prompt — fuse them into the photographic embodiment scaffold.** Trigger words belong next to the subject they activate; the `<lora:weight>` tag rides alongside; the negative prompt carries both weighted exclusions and any negative LoRA.

---

## 2. Photographic Embodiment Scaffold

A generation is only as believable as the physics it models. Structure every prompt as a blueprint, not a keyword list.

### 2.1 The Scaffold

```
[Subject] + [Action/pose] + [Lighting: pattern + direction] + [Lens: focal length + aperture] + [Style/Medium] + [Quality: native resolution + rendering terms] + [Negatives: weighted exclusions]
```

**Front-load the critical elements** — AI weights early tokens more heavily. A portrait lead (`"Oil painting of a castle…"`) vs. a style lead (`"A castle, oil painting…"`) produces different results.

### 2.2 Photographic Literacy Sub-Skills

| Sub-Skill | What it controls | Example |
|-----------|------------------|---------|
| **Lighting Pattern Mastery** | Studio setups sculpt form & mood | `Rembrandt lighting: key light 45° high, fill 1/4 power, subtle rim` |
| **Lens Selection** | Perspective, compression, emotional distance | `85mm portrait lens` (flattering compression) vs `24mm` (environment) |
| **Aperture Control** | Depth of field & subject isolation | `f/1.4–f/5.6` shallow · `f/8–f/32` deep |
| **Native Resolution** | Detail rendering, avoidance of upscaling artifacts | `4K native` for skin pores; avoid upscaling |
| **Vertical Format** | 9:16 composition for short-form platforms | Center subject, negative space above for text overlays |
| **Advanced Rendering** | Physics-based material & light response | `subsurface scattering on skin`, `ambient occlusion` |

These terms are the **vocabulary** the LoRA trigger words plug into. A LoRA supplies *a look*; the scaffold supplies *a photograph*.

---

## 3. LoRA Feature (Research-Backed)

LoRA (Low-Rank Adaptation) lets you inject a specific style, character, or concept as lightweight trained weights — without retraining the base model. Treat it as the **consistency-layer companion** to `--cref`/IP-Adapter: faster to load, reusable across scenes, and stackable.

The following practices are drawn from 2026 platform documentation and creator guides (full list in [References](#8-references)). Each is reflected in the live **LoRA Studio** and the docs.

### 3.1 Trigger words are mandatory
Most LoRAs only activate when their specific token(s) appear in the prompt. Copy them **verbatim from the model card** and weight them `(trigger:1.2)`–`(trigger:1.5)` for a stronger effect. Without the trigger, the LoRA may silently do nothing. *(Source: [Civitai — Mastering Trigger Words][r3])*

### 3.2 Match the base model
A LoRA trained for **SD1.5**, **SDXL**, or **FLUX** only applies to that base. A mismatch yields "no effect." On ComfyUI, verify the file is in `models/loras/` and both model + CLIP paths pass through *Load LoRA*. *(Source: [Easton Dev — ComfyUI LoRA guide][r4])*

### 3.3 Tune `strength_model` vs `strength_clip` separately
- `strength_model` alters the **UNet weights** (the image itself).
- `strength_clip` alters how the LoRA's **trigger words** are interpreted by the text encoder.

Keep `strength_model` **under ~1.5** to avoid overbaked noise and "LoRA hallucinations." Lowering `strength_clip` often improves results when blending concepts. *(Source: [ComfyUI Docs — Load LoRA][r2])*

### 3.4 Stack with a primary + secondaries
Define **one primary LoRA at ~0.8** and push others to **~0.3–0.5** so their traits don't overwrite one another. A safe photoreal stack:

```
Face Detail 0.7 + Skin Texture 0.5 + Studio Lighting 0.4   (combined ≈ 1.6)
```

Keep **total weight ≤ ~1.6–2.0**; stacking >3–4 LoRAs risks style collisions and character fade. *(Sources: [Easton Dev][r4], [Palmon AI — LoRA stacking rules][r6])*

### 3.5 Test each LoRA alone first
Weight-sweep (e.g., `0.3 → 1.2`) under a fixed seed/sampler/CFG before combining. This isolates conflicts and finds the useful range. *(Source: [Easton Dev][r4])*

### 3.6 Negative LoRAs
You can't place `<lora>` tags in A1111's negative field, but you can apply a **negative weight**, or load a **purpose-built negative LoRA** (e.g., a bad-hands type) in the negative prompt. *(Source: [Reddit — LoRA in negative prompt][r8])*

### 3.7 Multi-character separation
To stop two character LoRAs from blending, use **Regional Prompter / Latent Couple / Composable LoRA** (A1111) or **regional conditioning** (ComfyUI) so each region carries its own trigger. *(Source: [Reddit — several LoRAs simultaneously][r7])*

---

## 4. LoRA + Photography Embodiment Prompt Structure

To make a LoRA *photograph* instead of sticker-slap a style, fuse it into the photographic embodiment scaffold and let the trigger word sit **next to the subject it activates**.

### 4.1 Anatomy

```
[Subject + LoRA trigger] + [Action/pose] + [Lighting: pattern + direction]
+ [Lens: focal length + aperture] + [Style/Medium]
+ [<lora:name:weight>] + [Quality: native resolution + rendering]
+ [Negatives: weighted exclusions]
```

### 4.2 Worked example (SDXL portraiture)

```
portrait of a traveler, filmGrain, smiling naturally,
golden hour rim light from camera-left, 85mm f/1.8 shallow DOF,
analog film photography, <lora:analogFilm:0.7> <lora:filmGrain:0.5>,
4K native, subsurface scattering on skin
Negative: (plastic skin:1.3), (extra fingers:1.4), cartoon, blurry, low quality
```

### 4.3 Why it works
- `filmGrain` (the **trigger**) is placed immediately after the subject, so the LoRA fires on the right concept.
- Style-LoRA weights stay **≤ ~1.0**; a **primary** at ~0.8 anchors identity while detail/grain LoRAs sit at ~0.3–0.5.
- The **base model is matched** (SDXL) — otherwise the LoRA silently does nothing.
- The **negative** carries weighted exclusions that the LoRA's aesthetic might otherwise reintroduce.

> The **LoRA Studio** web app and the **"LoRA + Photography"** template (below) pre-fill this exact structure.

---

## 5. Live LoRA Studio (Web App)

`index.html` is a self-contained, dependency-free web app. The **LoRA Studio** section (nav: **LoRA**) is an interactive stack builder that turns the structure above into copy-ready syntax.

### 5.1 Inputs
- **Base Prompt (photographic embodiment)** — your Subject + Lighting + Lens + Quality scaffold.
- **Negative Prompt** — weighted exclusions (+ any negative LoRA note).
- **Quick Presets** — one-click LoRAs (each carries its trigger): Analog Film, Cinematic Color, Pixel Art, Character: Self, Arch Line Art, Film Grain.
- **+ Add LoRA** — creates a slot with:
  - **LoRA name** (filename, e.g. `filmGrain`)
  - **Trigger** (activation token, e.g. `filmGrain`)
  - **Category** (Style / Character / Concept / Aesthetic)
  - **Strength slider** (0.00–1.50)
  - **On/Off toggle**

### 5.2 Outputs (live, copy-ready)
- **SD WebUI / A1111** — `<lora:name:weight>` tags.
- **ComfyUI Node** — JSON array of `{"type":"lora","name":...,"strength":...}`.
- **PHOTOGRAPHY + LORA PROMPT** — the fused prompt: base → trigger words (next to subject) → `<lora:weight>` tags → `Negative:` line.

### 5.3 Research citations
A footnote under the section links the four pillars of the implementation:
trigger words · `strength_model`/`strength_clip` · stacking & base-model match · stacking rules.

### 5.4 Persistence
Your LoRA stack is saved to `localStorage`, so it survives reloads.

---

## 6. Copy-Paste Templates

### LoRA + Photography Embodiment

```
[Subject + LoRA trigger] + [Action] + [Lighting] + [Lens] + [Style]
+ [<lora:name:weight>] + [Quality] + [Negatives]

portrait of a traveler, filmGrain, golden hour rim light, 85mm f/1.8,
analog film, <lora:analogFilm:0.7> <lora:filmGrain:0.5>,
4K native, subsurface scattering
Negative: (plastic skin:1.3), (extra fingers:1.4), cartoon
```

### ComfyUI LoRA loading

```python
# LoRA loading (ComfyUI)
{"type": "lora", "name": "analogFilm", "strength_model": 0.7, "strength_clip": 0.6}

# SD WebUI / A1111 prompt tag
<lora:analogFilm:0.7>

# Stacking: primary ~0.8, secondaries 0.3-0.5; combined weight ~1.6-2.0
# Match base model (SD1.5 / SDXL / FLUX); include the model card trigger words
# Negative LoRA: negative weight, or a purpose-built negative LoRA in the negative prompt
```

### Full photographic scaffold (no LoRA)

```
[Subject: specific, active] + [Action/pose] + [Lighting: pattern + direction]
+ [Lens: focal length + aperture] + [Style: artistic reference]
+ [Quality: native resolution + rendering terms] + [Negatives: weighted exclusions]

"Professional headshot of a software engineer, smiling naturally,
Rembrandt lighting with key light 45° high and subtle fill,
85mm lens f/2.8 shallow depth of field, photorealistic style,
4K native resolution with subsurface scattering on skin,
(plastic skin:1.3) (airbrushed:1.2) (symmetrical face:1.1)"
```

---

## 7. Running Locally

The site is static — no build step. From the repo root:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

`index.html` links `styles.css` and `script.js` (the framework's real working styles/JS). `SKILL.md` and `skills.md` are the long-form knowledge bases; `README.md` (this file) is the wiki entry point.

---

## 8. References

- **[r1]** LoRA Models and How to Use Them with Stable Diffusion — *neura.market* · https://www.neura.market/directories/stable-diffusion/prompts/lora-models-and-how-to-use-them-with-stable-diffusion
- **[r2]** Load LoRA (node reference, `strength_model` / `strength_clip`) — *ComfyUI Docs* · https://comfyui.dev/docs/guides/nodes/load-lora/
- **[r3]** Mastering Trigger Words: LoRA Activation and Weighting — *Civitai* · https://civitai.com/articles/29014/mastering-trigger-words
- **[r4]** Use LoRA in ComfyUI: Weights and Stacking, Character Consistency — *Easton Dev* · https://eastondev.com/blog/en/posts/ai/20260720-comfyui-lora-guide/
- **[r5]** What drives LoRA impact in Stable Diffusion (ComfyUI strength_model vs strength_clip) — *Reddit r/StableDiffusion* · https://www.reddit.com/r/StableDiffusion/comments/1848ktb/what_drives_lora_impact_in_stable_diffusion/
- **[r6]** Palmon AI LoRA Prompts: The Ultimate Guide (stacking golden rules) — *yrom.com* · https://yrom.com/palmon-ai-lora-prompts-guide/
- **[r7]** Can you use several LoRAs simultaneously? — *Reddit r/StableDiffusion* · https://www.reddit.com/r/StableDiffusion/comments/18dhvep/can_you_use_several_loras_simultaneously_how_do/
- **[r8]** Is it possible to use a LoRA in the negative prompt? — *Reddit r/StableDiffusion* · https://www.reddit.com/r/StableDiffusion/comments/1bnj4lg/is_it_possible_to_use_a_lora_in_the_negative/

---

*License: CC-BY-SA 4.0 — Share, adapt, and contribute improvements back to the community.*
