# Professional AI Creator Skills (2026)

A comprehensive guide to mastering AI image and video generation. This document defines the essential skills, techniques, and workflows used by professionals to achieve consistent, high-quality results. It is structured for direct use by AI agents as an instruction reference.

---

## Table of Contents
1. [Introduction](#introduction)
2. [Core Skill Categories](#core-skill-categories)
   - [1. Technical Prompt Engineering](#1-technical-prompt-engineering)
   - [2. Photographic Literacy](#2-photographic-literacy)
   - [3. Strategic Negation & Skin Mastery](#3-strategic-negation--skin-mastery)
   - [4. Identity Preservation & Consistency](#4-identity-preservation--consistency)
   - [5. Post-Processing & Hybrid Workflows](#5-post-processing--hybrid-workflows)
   - [6. AI Agent Orchestration (New for 2026)](#6-ai-agent-orchestration-new-for-2026)
3. [Skill Levels Summary](#skill-levels-summary)
4. [Appendix: Copy-Paste Templates](#appendix-copy-paste-templates)
5. [Appendix: Platform Taxonomy](#appendix-platform-taxonomy)

---

## Introduction

Mastering generative AI requires a transition from simple "buzzword" prompting to a sophisticated reconstruction of real-world physics and photographic principles. This document organizes the core competencies into six primary domains, each with sub‑skills, techniques, and practical examples. It is intended as a living reference for AI agents and human practitioners alike.

---

## Core Skill Categories

### 1. Technical Prompt Engineering

**Description:** Constructing prompts as structured blueprints rather than random keyword lists.

#### Sub‑Skills

| Skill | Description | Example |
|-------|-------------|---------|
| **The Scaffold Method** | Use the order: `[Subject] + [Action] + [Lighting] + [Lens/Technical Specs] + [Style] + [Quality Modifiers]`. | `A woman walking in rain + cinematic lighting + 85mm f/1.8 + photorealistic + 4K` |
| **Information Priority (Front-Loading)** | Place the most important elements at the beginning of the prompt. | `Oil painting of a castle ...` (art style first) vs. `A castle, oil painting ...` |
| **Photographic Vocabulary** | Use precise technical terms instead of vague buzzwords. | Prefer `85mm lens, f/2.8` over `hyperrealistic`. |
| **Active Voice for Editing** | Use clear action verbs when directing edits. | `remove the background`, `add a red hat`, `turn the car into a truck` |
| **Agent Prompting Patterns** | Design prompts for AI agents using zero‑shot, few‑shot, chain‑of‑thought, and role‑based techniques. | `You are a professional photographer. First, think step by step about the lighting, then describe the shot.` |
| **Long‑Horizon Video Scripts** | Maintain coherence across extended narratives by translating coarse dialogue into detailed cinematic scripts. | Include camera directions, scene transitions, and character blocking. |
| **Camera Movement Language** | Specify complex camera techniques in prompts. | `pull from close-up to wide shot`, `circular tracking shot`, `dolly zoom` |

---

### 2. Photographic Literacy

**Description:** Reconstructing real‑world physics to achieve believable photorealism.

#### Sub‑Skills

| Skill | Description | Example |
|-------|-------------|---------|
| **Lighting Pattern Mastery** | Use classic studio setups to sculpt form and mood. | `Rembrandt lighting` (triangle under eye), `Butterfly lighting` (beauty), `Rim lighting` (separation), `Split lighting` (drama) |
| **Lens Selection** | Choose focal length for desired effect. | **Portrait:** `85mm–135mm` (compression, bokeh)<br>**Standard:** `35mm–50mm` (natural perspective)<br>**Wide:** `18mm–24mm` (scale, architecture) |
| **Aperture Control** | Use f‑stop to control depth of field. | **Shallow:** `f/1.4–f/5.6` (subject isolation)<br>**Deep:** `f/8–f/32` (landscapes, architecture) |
| **Native Resolution Management** | Select output resolution based on use case. | `720p` (preview), `1080p` (enhanced), `4K` (professional). Understand that native high‑res renders true detail (pores, fabric weave) that upscaling cannot add. |
| **Vertical Format Mastery** | Compose for short‑form platforms (9:16 aspect ratio). | Subject placement, background scaling, and dynamic composition optimized for TikTok, Reels, Shorts. |
| **Advanced Rendering Terms** | Use physics‑based cues. | `global illumination`, `ray tracing`, `ambient occlusion`, `subsurface scattering` (essential for skin) |

---

### 3. Strategic Negation & Skin Mastery

**Description:** Telling the AI what *not* to include to overcome unnatural perfection.

#### Sub‑Skills

| Skill | Description | Example |
|-------|-------------|---------|
| **Negative Prompting with Weights** | Actively exclude unwanted elements using weighted terms. | `(plastic skin:1.4)`, `(cartoon:1.3)`, `(extra fingers:1.4)` |
| **Skin Realism Management** | Simultaneously prompt for natural textures and negate synthetic ones. | **Prompt:** `visible pores, fine vellus hair, subtle skin imperfections`<br>**Negate:** `plastic skin, airbrushed, doll-like` |
| **Anatomical Correction** | Target common AI errors. | `(fused fingers, extra limbs, double iris:1.4)` |
| **Temporal Consistency for Video** | Prevent facial features, backgrounds, and objects from drifting across frames. | Use techniques like `retraining by error recycling` or reference‑based stabilization. |
| **Drift Correction** | Understand how generation artifacts can be fed back into models to improve stability over long sequences. | Implement iterative refinement with frame‑by‑frame feedback loops. |

---

### 4. Identity Preservation & Consistency

**Description:** Maintaining a specific character or style across multiple generations.

#### Sub‑Skills

| Skill | Description | Example |
|-------|-------------|---------|
| **Seed Locking** | Fix the initial noise pattern using the `--seed` parameter to enable controlled variations. | `--seed 12345` (Midjourney, Stable Diffusion) |
| **Reference Tools** | Use platform‑specific references for identity and style. | **Midjourney:** `--cref URL` (character), `--sref URL` (style)<br>**Stable Diffusion:** Reference images via ControlNet or IP‑Adapter |
| **Character Weight (`--cw`)** | Fine‑tune how much of a reference character is preserved. | `--cw 100` (face, hair, clothing) vs. `--cw 0` (face only) |
| **Multi‑Reference Consistency** | Use up to four reference images per generation to maintain character, object, and location consistency across scenes. | Combine character, background, and prop references. |
| **Agent‑Based Consistency** | Leverage AI agents (e.g., ScripterAgent, DirectorAgent) to maintain narrative coherence using cross‑scene continuous generation strategies. | Agents coordinate video models to ensure visual‑script alignment. |
| **Visual‑Script Alignment (VSA)** | Evaluate and maintain faithfulness between generated visuals and a given script or storyboard. | Use similarity metrics or human‑in‑the‑loop checks. |

---

### 5. Post-Processing & Hybrid Workflows

**Description:** Treating AI generation as the beginning of an iterative creative process.

#### Sub‑Skills

| Skill | Description | Example |
|-------|-------------|---------|
| **Iterative Refinement (Branching)** | Make small incremental changes to a base result while keeping the seed fixed. | Change `weather: rainy` → `snowy`; keep seed and rest of prompt. |
| **Inpainting & Outpainting** | Perform surgical edits (fix hands, eyes) or expand the canvas. | Use `Vary Region` (Midjourney) or generative fill (Photoshop). |
| **External AI Enhancement** | Use specialized tools for final polish. | **Topaz Photo AI** (upscaling, denoising), **Adobe Lightroom** (color grading) |
| **Unified Generation‑Editing** | Generate, edit, and refine within the same model context (e.g., Qwen Image 2.0, Gemini 2.5 Flash). | Iterate without leaving the generation interface. |
| **Cross‑Domain Compositing** | Combine elements from different sources (illustrated characters into real photographs) in a unified workflow. | Use layer‑based tools or inpainting to blend styles. |
| **Text Overlay Integration** | Add typography, posters, and multi‑lingual text during generation (e.g., Ideogram, Qwen). | Prompt for `text: "Hello World" in bold serif font at bottom` |

#### Production Deployment Skills (for enterprise use)

| Skill | Description |
|-------|-------------|
| **Model Serving** | Deploy models via REST/gRPC APIs with proper load and latency management. |
| **Quantization & Optimization** | Reduce model size and improve speed via ONNX export, TensorRT, etc. |
| **Monitoring & Logging** | Track errors, response times, and model drift in production. |
| **CI/CD for AI Pipelines** | Automate testing and redeployment of GenAI applications. |

---

### 6. AI Agent Orchestration (New for 2026)

**Description:** Designing and managing multi‑step, autonomous workflows where AI agents collaborate to achieve complex goals.

#### Sub‑Skills

| Skill | Description | Example |
|-------|-------------|---------|
| **Agent Architecture Design** | Understand how LLMs call tools, plan steps, and maintain memory. | Design a system where an agent can search the web, generate an image, and post it to social media. |
| **Router Pattern Implementation** | Direct queries to appropriate specialized agents using semantic routing. | Incoming request `"create a video ad"` → routed to video agent, not text agent. |
| **Small Language Model (SLM) Optimization** | Deploy 1B–10B parameter models for 40‑70% of enterprise tasks at 10‑30x lower cost. | Use SLMs for routine tasks, reserve large models for complex reasoning. |
| **Role‑Based Agent Teams** | Create specialized agents with distinct responsibilities. | `PlannerAgent`, `ResearcherAgent`, `WriterAgent`, `ReviewerAgent` |
| **Cross‑Agent Communication** | Design protocols where agents coordinate and share context. | Use a shared memory store or message bus. |
| **Autonomous Research Workflows** | Build agents that can search, summarize, and organize findings independently. | `ResearchAgent` tasked with gathering market trends and presenting a summary. |
| **Private Skill Deployment** | Encode proprietary workflows, compliance requirements, and internal policies as private skills that run inside organizational boundaries. | A `compliance-check.skill` that validates all outputs against company guidelines. |
| **Auditable Agent Workflows** | Ensure every agent action is tracked, reviewable, and compliant. | Log all tool calls, decisions, and intermediate outputs. |
| **Sovereign AI Infrastructure** | Deploy agent systems on private infrastructure while maintaining control over business knowledge. | Use on‑premise or VPC‑isolated deployments. |
| **Skills Packaging (SKILL.md)** | Write structured knowledge packages that encode workflows, procedures, and validation rules. | This document itself is an example of a `SKILL.md`. |

---

## Skill Levels Summary

| Level | Key Attributes | Typical Tools |
|-------|----------------|---------------|
| **Beginner** | Relies on natural language and buzzwords like "4K" or "detailed". | DALL‑E 3, Gemini, basic ChatGPT |
| **Intermediate** | Understands lens types, lighting patterns, and basic negative prompting. | Midjourney, SDXL, Leonardo, Ideogram |
| **Advanced** | Masters seeds, identity preservation (cref/sref), inpainting, and complex workflows. | ComfyUI, Midjourney v6/v7, ControlNet, Topaz Photo AI |
| **Expert** | Designs agentic systems, deploys models, and creates reusable skills packages. | Custom agents, LangChain, private model serving, SLMs |

---

## Appendix: Copy‑Paste Templates

| Use Case | Core Prompt Template |
|----------|----------------------|
| **Clean Studio Headshot** | `Head-and-shoulders corporate headshot, [skin tone] with natural skin texture, soft loop lighting with large softbox, neutral white balance, plain mid-gray background, 85mm lens, f/2.8` |
| **Dramatic Editorial** | `Three-quarter view portrait, visible pores, Rembrandt lighting (key 45° high), low-key mood, subtle rim light for separation, deep gray gradient backdrop, 105mm lens, shallow depth of field` |
| **Outdoor Golden Hour** | `Portrait at golden hour, [skin tone], soft warm backlight creating rim light, gentle fill light from front, butterfly lighting pattern, creamy bokeh, 85mm portrait lens` |
| **Corporate Product** | `High-end [product], morning sunlight casting soft shadows, split lighting, fine textures visible, sharp focus f/11, plain seamless background, 50mm lens` |
| **Inclusive Group Portrait** | `Group portrait, balanced range of skin tones, even soft lighting, loop lighting pattern, neutral color balance, simple environmental setting, 35mm lens for natural perspective` |
| **Cinematic Video Scene** | `[Scene description], camera: dolly zoom from wide to close-up on protagonist's face, lighting: golden hour backlight, 24fps, cinematic color grading, 4K` |
| **Multi‑Reference Character** | `--cref char1.jpg char2.jpg --sref style1.jpg style2.jpg --cw 80` *(platform‑specific syntax)* |

---

## Appendix: Platform Taxonomy

| Category | Platforms |
|----------|-----------|
| **Foundation Platforms (Image)** | Midjourney, Stable Diffusion / SDXL, DALL‑E 3 |
| **Pro‑Tier Image Generators** | Flux, Ideogram, Recraft, Seedream, Imagen, Photon, Lucid‑Origin |
| **Integrated Ecosystems** | ChatGPT (DALL‑E 3), Gemini (Imagen), Grok (Flux/Aurora), Meta, Qwen |
| **Video Frontier** | Wan 2.6, Vidu, Reve, Veo 3 / 3.1, Sora |
| **Agent Orchestration Frameworks** | LangChain, AutoGen, CrewAI, custom agent builders |

---

*This document is intended as a living reference. Last updated: February 2026.*

---

This `skill.md` can be uploaded to GitHub and used as an instruction set for AI agents. Its structured format makes it easy to parse and reference during task execution.
