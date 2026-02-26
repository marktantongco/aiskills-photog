---
name: aiskills-photog
description: AI Photorealistic Image Generation Skills Framework. Covers technical prompt engineering, photographic physics, material science, lens optics, lighting architecture, skin realism, strategic negation, and platform-specific optimization for achieving true photorealism.
---

# AI Photorealistic Image Generation: Complete Technical Framework

> A comprehensive guide to achieving true photorealism in AI image generation through photographic physics, material science, and strategic prompt engineering.

*Last updated: February 2026 | Version 4.0 | Format: SKILL.md*

---

## Quick Reference: Skill Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FOUNDATION                                │
│  Technical Prompt Scaffold + Optical Physics                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 OPTICAL MECHANICS                            │
│  Focal Length + Aperture + Anamorphic Lenses               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              LIGHTING ARCHITECTURE                           │
│  Lighting Patterns + Ratios + Material Science              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              SKIN REALISM (Uncanny Valley Fix)              │
│  Subsurface Scattering + Micro-Textures + Film Emulation   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              STRATEGIC NEGATION                             │
│  Weighted Exclusions + Troubleshooting Matrix               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              POST-PROCESSING & WORKFLOWS                    │
│  Seed Locking + Inpainting + Platform Optimization          │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. The Core Problem: Why AI Images Look "Waxy"

### The Buzzword Trap

The "AI look" — waxy skin, plastic textures, flattened lighting — is a **user error**, not a model limitation.

| ❌ Avoid | ✅ Use Instead |
|----------|---------------|
| "hyperrealistic" | Specific lens specs |
| "8K, ultra-detailed" | Sensor references |
| "professional lighting" | Named lighting patterns |
| "beautiful skin" | Anatomical micro-details |

**Why Buzzwords Fail**: "8K" and "hyperrealistic" tell the AI to average millions of mediocre stock photos, resulting in over-processed skin and flattened lighting.

### The Uncanny Valley Mechanism

The uncanny valley occurs when AI produces:
- Too-smooth, airbrushed skin (no pores, no texture)
- Lifeless eyes (no catchlights, no depth)
- Symmetrical faces (unnatural perfection)
- Flat, front-lit lighting (no dimension)

**The Fix**: Treat AI as a **simulator**, not a renderer. Provide initial conditions (lens, lighting, physics) rather than desired outcomes.

---

## 2. Technical Prompt Scaffold

A professional prompt is an **architectural blueprint**, not a keyword list. AI processes sequentially — front-load critical information.

### Universal Formula

```
[STYLE/MEDIUM] + [SUBJECT] + [ACTION/POSE] + [FRAMING] + [SETTING] + [LIGHTING] + [CAMERA SPECS] + [MATERIAL DETAILS] + [QUALITY/REFERENCE]
```

### Token Weighting Syntax

Use parentheses with weights to manipulate attention layers:

| Syntax | Effect |
|--------|--------|
| `(keyword:1.1–1.2)` | Subtle emphasis |
| `(keyword:1.3–1.4)` | Strong emphasis (recommended) |
| `(keyword:1.5+)` | Overrides default behavior |

---

## 3. Optical Mechanics: Lens Physics for Realism

### Focal Length & Psychological Impact

| Focal Length | Perception | Best For |
|--------------|-----------|----------|
| 16–24mm | Depth expansion; face appears rounder, more approachable | Environmental portraits, architecture |
| 35mm | Moderate expansion; immersive "environmental" feel | Street photography, contextual portraits |
| 50mm | Natural perspective; approximates human vision | Baseline realism, "natural" look |
| 85mm | Subtle compression; flattering facial morphology | Professional headshots, executive portraits |
| 105mm+ | Extreme compression; flatter, more "elite" appearance | High-status portraits, beauty shots |

**The 50mm Rule**: 50mm is the baseline for naturalism because it approximates the diagonal of a full-frame sensor — the same magnification as human vision.

**Telephoto Trade-off**: 85mm–200mm compress features flatteringly (smarter, more attractive) but create psychological distance (less approachable).

### Aperture (f-stop) Control

| Aperture | Effect |
|----------|--------|
| f/1.4–f/2.8 | Shallow depth of field; creamy bokeh; subject isolation |
| f/4–f/5.6 | Moderate DOF; balanced sharpness |
| f/8–f/11 | Deep focus; entire scene sharp (landscapes, products) |

### Anamorphic Cinematography

| Artifact | Description |
|----------|-------------|
| Oval Bokeh | Vertically elongated out-of-focus highlights |
| Horizontal Flares | Blue-streak halation from cylindrical diffraction |
| Compressed DOF | Heightened subject-to-background dimensionality |
| Edge Softness | Organic vignetting and focus fall-off |

**Squeeze Factors**: 1.33x → 2.39:1 | 1.5x → Moderate | 2x → Historical "Scope"

---

## 4. Lighting Architecture

### Core Lighting Patterns

| Pattern | Setup | Mood/Use |
|---------|-------|----------|
| **Rembrandt** | Key light 45° off-axis, above eye level; small triangle on shadow cheek | Dramatic, intellectual depth |
| **Butterfly (Paramount)** | Light centered, above subject; butterfly shadow under nose | Beauty, glamour |
| **Loop** | Light 30–45° to side, slightly above | Flattering, approachable |
| **Split** | Light 90° to side | High drama, moody |
| **Rim/Edge** | Light behind subject | 3D separation, halo effect |
| **Chiaroscuro** | High contrast, deep shadows | Renaissance texture, mystery |

### Natural Light Simulation

| Condition | Characteristics |
|-----------|----------------|
| **Golden Hour** | Low-angle warm light; long soft shadows |
| **Overcast** | Soft, diffused, low-contrast; naturalistic |
| **Window Light** | Directional trust; wrap-around quality |
| **Blue Hour** | Cool, melancholic, cinematic |

### Lighting Ratios

| Ratio | Contrast | Best For |
|-------|----------|----------|
| 1:1 | Flat | Beauty, product |
| 2:1 | Subtle | Portraits |
| 4:1 | Professional | Corporate headshots |
| 8:1+ | Dramatic | Artistic |

### Advanced Rendering Terms

| Term | Effect |
|------|--------|
| **Subsurface Scattering (SSS)** | Light penetrates surface, scatters internally; critical for skin |
| **Global Illumination** | Physically accurate light bounces |
| **Ray Tracing** | Accurate reflections, shadows, caustics |
| **Ambient Occlusion** | Contact shadows in crevices |

---

## 5. Skin Realism: Conquering the Uncanny Valley

### The Subsurface Scattering Imperative

In real skin:
- **6%** direct reflectance
- **94%** subsurface scattering (light penetrates, scatters, exits)

**Without SSS**: Skin looks like opaque plastic.

**Prompt**: `subsurface scattering, translucent skin, light penetrating skin surface`

### Micro-Texturing

| Element | Prompt |
|---------|--------|
| Pores | `visible skin pores, pore-level detail` |
| Hair | `vellus hair, fine peach fuzz` |
| Imperfections | `subtle blemishes, natural asymmetry` |
| Texture | `skin grain, natural skin variation` |

### Film Stock Emulation

| Film | Character |
|------|-----------|
| **Kodak Portra 160/400** | Natural skin tones, flattering |
| **Kodak Vision3 50D** | Ultra-fine organic grain, cinematic |
| **Fuji Pro 400H** | Soft pastel highlights |
| **Kodak Tri-X 400** | High contrast, gritty |

---

## 6. Strategic Negation

### Troubleshooting Matrix

| Problem | Root Cause | Solution |
|---------|-----------|----------|
| Waxy/Plastic Skin | "Hyperrealistic" buzzwords | Use lens specs + `(visible pores:1.4)` |
| Distorted Faces | Wide-angle default | Use 85mm+ lens |
| Flat Lighting | No lighting pattern | Specify Rembrandt/Loop |
| Cartoonish | Style ambiguity | `--style raw` + negate `(cartoon:1.3)` |
| Extra Fingers | Anatomy failure | `(extra fingers:1.4)` |
| Dead Eyes | Lack of life | Prompt `catchlights, iris detail` |

### The Ultimate Negative Prompt Block

```
(worst quality, low quality:1.4), (blurry:1.2), jpeg artifacts, 
(cartoon, anime, illustration:1.3), 3d render, cgi, 
(plastic skin, waxy skin, poreless, airbrushed:1.4), 
(bad anatomy, deformed hands, extra fingers:1.4), 
(dead eyes, lifeless eyes:1.3), (smooth skin:1.2)
```

---

## 7. Platform-Specific Optimization

### Midjourney v6/v7

| Parameter | Setting for Photorealism |
|-----------|-------------------------|
| `--style raw` | Reduces "painterly" bias |
| `--stylize` | 500–750 (lower = more literal) |
| `--cref` | Character reference |
| `--sref` | Style reference |
| `--cw` | 0 = face only; 100 = full |

### Stable Diffusion XL (SDXL)

| Technique | Purpose |
|-----------|---------|
| Base + Refiner | Two-stage 1024×1024 detail |
| CFG Scale 7.0–8.5 | Balance adherence + quality |
| DPM++ 2M Karras | Best skin/hair |
| ControlNet | Pose, depth, canny |

### DALL-E 3 / ChatGPT

| Approach | Rationale |
|----------|-----------|
| Natural language | Describe conversationally |
| "Reduce retouching" | Counters illustrative bias |

---

## 8. Post-Processing & Refinement Workflows

### The Consistency Workflow

1. **Seed Locking**: `--seed 12345` holds initial noise
2. **Character Reference**: `--cref face.jpg`
3. **Style Reference**: `--sref style.jpg`
4. **Inpainting**: Fix specific errors surgically

### Resolution Strategy

- Generate at **4K+ native** for detail
- **HiRes Fix**: Upscale + add high-frequency detail
- **External AI**: Topaz Photo AI, Lightroom

---

## 9. Master Prompt Templates

### Corporate Executive Headshot

```
[Full shot] of a [middle-aged CEO] in a [bespoke charcoal wool suit], 
standing by [floor-to-ceiling high-rise window], [blurred NYC cityscape 
backdrop], [soft natural window light as key light], [85mm lens, f/2.8], 
[unprecedented eye-focus], [natural skin pores, asymmetrical facial 
features], [Kodak Portra 400 film emulation], --style raw --ar 4:5
```

### Cinematic Portrait (Anamorphic)

```
[Eye-level] portrait of a [young professional], [cinematic 2.39:1], 
[anamorphic lens 2x squeeze], [horizontal blue streak flares], 
[oval bokeh], [Rembrandt lighting], [105mm focal length], [f/2.8], 
[visible skin pores, vellus hair], [subsurface scattering], 
[ARRI Alexa 35 color], --style raw
```

### Product Photography

```
[High-end watch] on [marble surface], [soft overhead daylight], 
[split lighting], [fine texture visible], [sharp focus f/11], 
[50mm lens], [Phase One IQ4 150MP], --ar 1:1
```

---

## Quick Reference Card

| Category | Technical Term | Buzzword |
|----------|---------------|----------|
| Lens | 85mm f/1.8 | "portrait mode" |
| Lighting | Rembrandt | "dramatic" |
| Skin | visible pores | "perfect skin" |
| Film | Kodak Portra 400 | "vintage look" |
| Quality | Phase One IQ4 | "8K" |
| Camera | ARRI Alexa 35 | "cinematic" |

---

## Competency Progression

| Level | Focus |
|-------|-------|
| **Beginner** | Natural language prompts, basic platform navigation |
| **Intermediate** | Technical vocabulary, lighting/lens basics, negation |
| **Advanced** | Seed/reference control, inpainting, hybrid workflows |
| **Expert** | Agent orchestration, production deployment, skills packaging |

---

## Related Skills

- **vercel-react-best-practices**: For AI agent system design
- **shadcn-ui**: For UI component integration with AI outputs
- **framer-motion-animator**: For AI-generated video workflows
- **linkedin-content**: For sharing AI-generated assets

---

*License: CC-BY-SA 4.0  
Source: Consolidated from multiple AI photorealism frameworks (2025-2026)  
Format: SKILL.md for AI agent consumption*
