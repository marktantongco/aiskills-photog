---
name: ai-creator-suite
description: Complete AI Creator Skills Framework integrating photorealistic image generation, React/Next.js performance optimization, shadcn/ui component patterns, Framer Motion animations, and AI-powered content distribution. A unified reference for building production-ready AI applications.
tags: [ai, image-generation, photorealism, prompt-engineering, react, nextjs, shadcn-ui, framer-motion, animation, performance, linkedin, content-creation, social-media]
category: ai-development
version: 5.0
lastUpdated: 2026-02-26
requires: [aiskills-photog, vercel-react-best-practices, shadcn-ui, framer-motion-animator, linkedin-content]
---

# AI Creator Suite

**Comprehensive Skills Framework for Building Production-Ready AI Applications**

---

## Table of Contents

1. [AI Photorealism](#1-ai-photorealism)
2. [React Performance](#2-react-performance)
3. [UI Components](#3-ui-components)
4. [Animations](#4-animations)
5. [Content Distribution](#5-content-distribution)
6. [Integration Patterns](#6-integration-patterns)

---

## 1. AI Photorealism

### The Core Problem

The "AI look" — waxy skin, plastic textures, flattened lighting — is a **user error**, not a model limitation.

### The Buzzword Trap

| Avoid | Use Instead |
|-------|-------------|
| `hyperrealistic` | Specific lens specs |
| `8K ultra-detailed` | Sensor references |
| `professional lighting` | Named lighting patterns |
| `beautiful skin` | Anatomical micro-details |

### Prompt Scaffold

**Formula:** `[STYLE/MEDIUM] + [SUBJECT] + [ACTION/POSE] + [FRAMING] + [SETTING] + [LIGHTING] + [CAMERA SPECS] + [MATERIAL DETAILS]`

### Token Weighting

| Syntax | Effect |
|--------|--------|
| `(keyword:1.1)` | Subtle emphasis |
| `(keyword:1.3)` | Strong emphasis |
| `(keyword:1.5)` | Override default |

### Focal Length Guide

| Focal Length | Perception | Best For |
|--------------|-----------|----------|
| 16–24mm | Depth expansion | Environmental portraits |
| 50mm | Natural perspective | Baseline realism |
| 85mm | Flattering compression | Professional headshots |
| 105mm+ | Elite appearance | High-status portraits |

### Lighting Patterns

- **Rembrandt**: Key light 45° off-axis; triangle on shadow cheek
- **Butterfly**: Centered above; butterfly shadow under nose
- **Loop**: 30–45° to side, slightly above
- **Rim**: Behind subject; 3D separation

### Skin Realism

**Subsurface Scattering:** In real skin, 94% is subsurface scattering.

**Prompt**: `subsurface scattering, translucent skin, visible pores, vellus hair`

### Film Stock Emulation

| Film | Character |
|------|-----------|
| Kodak Portra 160/400 | Natural skin tones |
| Kodak Vision3 50D | Ultra-fine grain, cinematic |
| Fuji Pro 400H | Soft pastel highlights |

### Strategic Negation

```
(worst quality:1.4), (blurry:1.2), (cartoon, anime:1.3), 
(plastic skin, waxy skin, poreless:1.4), (bad anatomy, extra fingers:1.4)
```

### Platform Optimization

**Midjourney v6/v7:**
- `--style raw` — Reduces painterly bias
- `--stylize` 500–750 — For photorealism
- `--cref` — Character reference
- `--cw` — 0=face only; 100=full

**Stable Diffusion XL:**
- Base + Refiner — Two-stage 1024×1024 detail
- CFG Scale 7.0–8.5 — Balance adherence + quality

### Master Templates

**Corporate Executive:**
```
[Full shot] of a [middle-aged CEO] in a [bespoke charcoal wool suit], 
standing by [floor-to-ceiling high-rise window], [soft natural window light], 
[85mm lens, f/2.8], [natural skin pores], [Kodak Portra 400], 
--style raw --ar 4:5
```

---

## 2. React Performance

### Rule Priority Matrix

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating Waterfalls | CRITICAL | `async-` |
| 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
| 3 | Server-Side Performance | HIGH | `server-` |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization | MEDIUM | `rerender-` |
| 6 | Rendering Performance | MEDIUM | `rendering-` |

### Eliminating Waterfalls

- `async-parallel` — Use Promise.all() for independent operations
- `async-dependencies` — Use better-all for partial dependencies
- `async-suspense-boundaries` — Use Suspense to stream content

### Bundle Size Optimization

- `bundle-barrel-imports` — Import directly, avoid barrel files
- `bundle-dynamic-imports` — Use next/dynamic for heavy components
- `bundle-defer-third-party` — Load analytics/logging after hydration

### Server-Side Performance

- `server-cache-react` — Use React.cache() for per-request deduplication
- `server-parallel-fetching` — Restructure components to parallelize fetches
- `server-after-nonblocking` — Use after() for non-blocking operations

### Re-render Optimization

- `rerender-defer-reads` — Don't subscribe to state only used in callbacks
- `rerender-memo` — Extract expensive work into memoized components
- `rerender-transitions` — Use startTransition for non-urgent updates

### Rendering Performance

- `rendering-conditional-render` — Use ternary, not && for conditionals
- `rendering-content-visibility` — Use content-visibility for long lists

### Quick Reference

| Pattern | Code |
|---------|------|
| Parallel fetch | `Promise.all([fetchA(), fetchB()])` |
| Dynamic import | `const Heavy = dynamic(() => import('./Heavy'))` |
| Memo component | `const Comp = memo(({data}) => <div>{data}</div>)` |
| Start transition | `startTransition(() => setState(value))` |

---

## 3. UI Components

### Installation

```bash
npx shadcn@latest init
npx shadcn@latest add button input card dialog form
```

### Core Dependencies

```json
{
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "lucide-react": "^0.294.0"
}
```

### Button Component

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Form with Validation

```tsx
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8),
})

export function LoginForm() {
  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: {} })
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Dialog Component

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
    </DialogHeader>
    {/* Form content */}
  </DialogContent>
</Dialog>
```

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### CSS Variables

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

---

## 4. Animations

### Installation

```bash
npm install framer-motion
```

### Basic Animation

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {children}
</motion.div>
```

### Hover & Tap

```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
```

### Exit Animations

```tsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

### Staggered Children

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.ul variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li variants={itemVariants}>{item}</motion.li>
  ))}
</motion.ul>
```

### Scroll Animations

```tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function FadeInWhenVisible({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
```

### Page Transitions (Next.js)

```tsx
// app/template.tsx
'use client';
import { motion } from 'framer-motion';

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Transition Presets

```tsx
export const transitions = {
  spring: { type: 'spring', stiffness: 300, damping: 24 },
  springBouncy: { type: 'spring', stiffness: 500, damping: 15 },
  smooth: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
  snappy: { type: 'tween', duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
};
```

### Reduced Motion

```tsx
import { useReducedMotion } from 'framer-motion';

function AccessibleAnimation({ children }) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 5. Content Distribution

### Quick Start

```bash
curl -fsSL https://cli.inference.sh | sh && infsh login
```

### Post Anatomy

```
┌─────────────────────────────────────┐
│ HOOK (first 1-2 lines)             │ ← Visible before "...see more"
│ ...see more ─────────────────────── │
│ BODY (story/value)                  │
│ - Formatted with line breaks        │
│ CTA (last 1-2 lines)                │
│ #hashtags (3-5)                    │
└─────────────────────────────────────┘
```

### Hook Formulas

| Formula | Example |
|---------|---------|
| Contrarian | "Unpopular opinion: code reviews are a waste of time." |
| Personal story | "I got fired on a Tuesday. Best thing that happened." |
| Bold statement | "Your resume doesn't matter. Here's what does." |

### Character Limits

| Element | Limit |
|---------|-------|
| Post text | 3,000 |
| Visible before "see more" | ~210 |
| Hashtags | 3-5 |

### Content Pillars

| Pillar | Example |
|--------|---------|
| Expertise | "5 database patterns every engineer should know" |
| Stories | "The hardest feedback I ever received" |
| Opinions | "AI won't replace engineers. Bad managers will." |

### CTA Formulas

- "What's the worst career advice you've received?"
- "Agree or disagree?"
- "Repost if this resonates"

### Post Types (Ranked)

| Type | Engagement |
|------|-----------|
| Personal story + lesson | Very High |
| Contrarian take | High |
| List/tips (numbered) | High |
| Poll | Medium-High |
| Link post | Low |

### Generate Visual

```bash
infsh app run falai/flux-dev-lora --input '{
  "prompt": "candid professional photo, person speaking at conference",
  "width": 1200,
  "height": 900
}'
```

---

## 6. Integration Patterns

### AI Image → React Component → Animation

```tsx
"use client"
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

export function AIImageCard({ imageUrl, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card>
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <CardContent>
          <h3>{title}</h3>
          <p>{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

### Form with AI Image Generation

```tsx
"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from 'framer-motion';

export function ImageGeneratorForm() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    // Call AI image API
    const result = await fetch('/api/generate', { 
      method: 'POST', 
      body: JSON.stringify({ prompt }) 
    });
    const data = await result.json();
    setImage(data.url);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
      />
      <Button onClick={generate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </Button>
      <AnimatePresence>
        {image && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={image}
            alt="Generated"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

### Performance-Optimized Gallery

```tsx
"use client"
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function ImageGallery({ images }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {images.map((img, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(img)}
            className="cursor-pointer"
          >
            <img src={img.thumbnail} alt="" className="w-full rounded-lg" />
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl">
          {selected && <img src={selected.full} alt="" className="w-full" />}
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Content Pipeline

```
AI Image Generation → shadcn Card → Framer Motion Animation → LinkedIn/X Distribution
```

---

## Quick Reference Matrix

| Skill | Key Commands | Best For |
|-------|-------------|----------|
| Photorealism | `85mm f/1.8`, `Rembrandt`, `subsurface scattering` | Image generation |
| React Perf | `Promise.all()`, `memo()`, `dynamic()` | Performance |
| shadcn/ui | `npx shadcn@latest add button` | UI components |
| Framer | `<motion.div whileHover={{}}>` | Animations |
| LinkedIn | Hook + Story + CTA | Content distribution |

---

## Related Skills

- `aiskills-photog` — AI photorealism foundation
- `vercel-react-best-practices` — React performance rules
- `shadcn-ui` — Component library
- `framer-motion-animator` — Animation patterns
- `linkedin-content` — Content distribution

---

## Competency Path

| Level | Focus |
|-------|-------|
| Beginner | Single skill mastery |
| Intermediate | Combine 2-3 skills |
| Advanced | Full pipeline integration |
| Expert | Custom patterns & optimization |

---

*License: CC-BY-SA 4.0  
Version: 5.0 | February 2026  
Format: SKILL.md for AI agent consumption*
