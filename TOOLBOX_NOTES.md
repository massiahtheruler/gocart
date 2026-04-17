# Toolbox Notes

## How To Use This Note
- `Global` means editor or machine setup that applies across projects.
- `Project` means install or configure it inside a specific app.
- `Optional` means useful, but not something every project needs.

## Motion
- Type: Project package
- Use when: you want polished animations, transitions, micro-interactions, or a more premium UI feel
- Avoid when: the project is very simple or motion would distract from the design
- How to add: `npm install motion`
- Quick note: use `import { motion } from "motion/react";`
- Good for:
  - modal entrance animations
  - hover/tap feedback
  - page content fade/slide in
  - like/follow/tweet interactions

## Shadcn/UI
- Type: Project tool / component system
- Use when: you want accessible, customizable base components that live in your codebase
- Avoid when: you do not want another UI system or you are happy building components from scratch
- How to add: run the shadcn CLI in a project and generate only the components you want
- Quick note: this is not mainly a VS Code extension; it is a project setup choice
- Good for:
  - buttons
  - dialogs
  - dropdowns
  - form controls
- Watch out:
  - if you use it lazily, a lot of projects can start to look the same
  - customize it hard if you want a more artistic visual identity

## TanStack Query
- Type: Project package
- Use when: the app has a lot of server state, mutations, optimistic updates, or complex async data flows
- Avoid when: the app is simple or SWR already covers what you need
- How to add: install in the project, add `QueryClientProvider` at the app root, then use `useQuery` / `useMutation`
- Quick note: not a global tool; choose it per project
- Good for:
  - social apps
  - dashboards
  - CRUD-heavy apps
  - optimistic likes/posts/follows

## Zod
- Type: Project package
- Use when: you want safer forms, API validation, or runtime protection around incoming data
- Avoid when: the project is tiny and the data surface is very small
- How to add: install in the project and use schemas near forms, API routes, or fetch layers
- Quick note: excellent once you start doing freelance or production-style work
- Good for:
  - form validation
  - request body validation
  - parsing API responses

## React Icons
- Type: Project package
- Use when: you want fast access to lots of icon packs
- Avoid when: you need a very custom icon system with a tightly unified style
- How to add: `npm install react-icons`
- Quick note: good for prototypes and many real projects, but mixing icon packs too much can look inconsistent
- Good for:
  - sidebars
  - buttons
  - status icons

## Tailwind CSS IntelliSense
- Type: Global VS Code extension
- Use when: you are using Tailwind
- Avoid when: the project is not using Tailwind
- Quick note: gives class autocomplete, hover info, and validation

## Error Lens
- Type: Global VS Code extension
- Use when: you want errors and warnings shown inline
- Avoid when: you find too much on-screen feedback distracting
- Quick note: good for catching problems faster, but it does not usually affect autocomplete

## Prettier
- Type: Global VS Code extension + project formatting tool
- Use when: you want consistent formatting
- Avoid when: the team/project has a different formatter standard
- Quick note: best kept as a default formatter in most frontend projects

## ESLint
- Type: Global VS Code extension + project lint tool
- Use when: you want inline code quality feedback and safer patterns
- Avoid when: almost never in TypeScript/React work
- Quick note: great for catching mistakes early

## Responsively App
- Type: Global app/tool outside the codebase
- Use when: you are testing responsive layouts a lot
- Avoid when: the project is not UI-heavy
- Quick note: shows multiple device sizes at once; much faster than resizing one browser repeatedly

## Headwind
- Type: Global VS Code extension
- Use when: you want Tailwind classes sorted consistently
- Avoid when: class sorting feels distracting while you are still learning Tailwind
- Quick note: cleanup helper, not essential

## CSS Peek
- Type: Global VS Code extension
- Use when: you work in regular CSS files a lot
- Avoid when: the project is mostly Tailwind
- Quick note: lower priority in Tailwind-heavy projects

## Console Ninja
- Type: Global VS Code extension
- Use when: you want console output directly in the editor
- Avoid when: inline console noise annoys you
- Quick note: try it and judge; this one is taste-dependent

## Import Cost
- Type: Global VS Code extension
- Use when: you want quick visibility into package weight
- Avoid when: you are early in a project and speed of learning matters more than micro-optimizing imports
- Quick note: helpful, but not urgent

## Good Global Defaults
- Bracket pair colorization
- Bracket guides
- Indentation guides
- Format on save
- ESLint fix on save
- TypeScript and JavaScript update imports on file move
- Inlay hints
- Tailwind Emmet completions

## Watch Outs
- Too many AI/code assistant extensions at the same time can hurt suggestions instead of helping
- One strong assistant plus TypeScript/Tailwind tooling is usually better than several competing helpers
- Generated Next.js files inside `.next` can cause fake route/type chaos; if things get weird after file moves, rebuild the dev cache

## Good Next Adds
- Framer/Motion usage in more components
- Zod once forms and APIs get more serious
- TanStack Query only if SWR starts feeling limiting
- Shadcn/UI when you want a reusable component system in a fresh project

## Motion / Polish Ideas

### Spring Motion
- Type: Project package / technique
- Use when: you want buttons, cards, modals, and transitions to feel more physical and polished
- How to add: already installed via `motion`
- Quick note: use spring transitions, `whileHover`, and `whileTap` for tasteful interactivity
- Good for:
  - buttons
  - cards
  - modal entrance
  - subtle hover lift

### Lenis
- Type: Project package
- Use when: you want smooth scrolling on a portfolio, editorial site, brand site, or other experience-first project
- Avoid when: the project is a simple utility app or the added smoothness does not improve the experience
- Quick note: not a default for every site; better for premium-feeling showcase work

### Glassmorphism
- Type: CSS technique
- Use when: you want frosted-glass layers, translucent cards, or modals over imagery
- Avoid when: the design already has low contrast or the blur makes the UI harder to read
- Quick note: usually built with `backdrop-filter`, transparency, and careful border/shadow work

### 60-30-10 Color Rule
- Type: Design principle
- Use when: you want stronger color discipline in UI design
- Quick note:
  - 60% neutral base
  - 30% secondary tone
  - 10% accent

### Optimistic Updates
- Type: Data interaction pattern
- Use when: you want likes, follows, saves, or similar actions to feel instant
- Avoid when: the action is too high-risk to fake locally first
- Quick note: update the UI immediately, then roll back if the server fails
- Good for:
  - likes
  - follows
  - saving posts

### Sonner
- Type: Project package
- Use when: you want elegant toast notifications
- Avoid when: your current toast library already works well and you do not want to switch
- Quick note: worth considering later, but `react-hot-toast` is already fine

### Custom Cursor
- Type: Project feature / effect
- Use when: you are building a portfolio or highly art-directed interactive site
- Avoid when: the project is a standard app, accessibility is a top concern, or the effect distracts from usability
- Quick note: best used selectively and subtly

### React Tilt
- Type: Project package
- Use when: you want a small amount of 3D card interaction on portfolio or product-focused interfaces
- Avoid when: the whole UI starts feeling gimmicky
- Quick note: seasoning, not the whole design language

### Magic UI
- Type: Project package / component library
- Use when: you want flashy interaction ideas or polished effect components
- Avoid when: you do not want the project style shaped by a prebuilt effect library
- Quick note: good inspiration source; use intentionally

### Aceternity UI
- Type: Project package / component library
- Use when: you want dramatic background/effect components for a high-style site
- Avoid when: you need a restrained, product-focused app UI
- Quick note: powerful, but easy to overuse

## Advanced / Later Tools

### GSAP
- Type: Project package
- Use when: you want timeline-based animation, choreographed sequences, or more advanced motion control than component-level animation alone
- Avoid when: the animation needs are simple and `motion` already covers them cleanly
- Quick note: excellent for sequence-based motion thinking; especially useful for artistic frontend work
- Good for:
  - entrance sequences
  - staged hero animations
  - product storytelling
  - scroll-driven animation

### Chrome Performance Tab
- Type: Browser/devtools skill
- Use when: you want to understand animation jank, layout thrash, rendering slowdowns, or performance bottlenecks
- Quick note: one of the most valuable non-library frontend skills to learn early
- Good for:
  - checking smoothness
  - diagnosing stutter
  - seeing which interactions are expensive

### Upstash
- Type: Project/backend service
- Use when: you need fast caching, rate limiting, counters, trending data, or similar server-side memory-like behavior
- Avoid when: the app is still simple and does not have a real speed/caching problem yet
- Quick note: useful later, but not a must-learn-first tool

### Relume
- Type: Design/build workflow tool
- Use when: you want to build standard sections quickly and save your energy for the more custom/artistic parts
- Avoid when: you want to design every part from scratch or avoid leaning on prebuilt structure
- Quick note: speed tool, not a core frontend skill

## Databases / Backend Choices

### PostgreSQL
- Type: Database / core backend skill
- Use when: the project has relationships between data, structured queries, filtering, sorting, or reporting needs
- Quick note: one of the most durable backend skills to learn; especially strong for social apps, dashboards, and commerce
- Good for:
  - users and posts
  - comments and likes
  - orders and products
  - follows and notifications

### Supabase
- Type: Project platform / backend service
- Use when: you want Postgres plus auth, storage, and optional realtime in a React/Next-friendly setup
- Avoid when: you want full control over every backend layer from scratch
- Quick note: very strong full-stack choice, especially for apps with auth + relational data + media
- Good for:
  - social apps
  - portfolios with admin panels
  - startup-style SaaS projects

### Railway
- Type: Project hosting / backend platform
- Use when: you want app hosting plus database/cache/services in one place
- Avoid when: the project is purely static and does not need backend infrastructure
- Quick note: especially useful for full-stack apps and predictable project setups

### Medusa.js
- Type: Project e-commerce backend
- Use when: you want a serious commerce backend without building every store feature from scratch
- Avoid when: the site is still a concept/demo or you do not need full commerce logic yet
- Quick note: more specific than Supabase/Postgres; good once the e-commerce project becomes real

### Sneaker / Product Data APIs
- Type: Project data source
- Use when: you want real product data, pricing, SKUs, and images instead of placeholder content
- Avoid when: you are still designing, prototyping, or learning the frontend flow
- Quick note: later-stage tool, not an early must-have

## Visual Helper Tools

### Shadow Palette Generator
- Type: Visual helper tool
- Use when: you want more realistic, layered shadows for cards, modals, floating panels, or premium product UI
- Avoid when: the design is intentionally flat or minimal and shadows would add noise
- Quick note: helps generate more believable shadows than a single default box-shadow

### Cubic-Bezier.com
- Type: Motion helper tool
- Use when: you want custom easing for animations instead of basic presets like `ease-in-out`
- Avoid when: default motion timing already feels right and the interaction does not need extra tuning
- Quick note: very useful for learning how motion timing affects feel

### SVG Repo
- Type: Asset source
- Use when: you need SVG icons or illustrations you can customize or animate
- Avoid when: the project already has a tightly defined icon language and a random external asset would break consistency
- Quick note: useful, but always check that styles match before mixing assets together

## Reference / Design / Debug

### Figma
- Type: Design / planning tool
- Use when: you want to plan layouts, test color systems, gather references, or think through UI before coding
- Avoid when: the idea is so small that sketching it in code is faster
- Quick note: not just for mockups; great for visual system thinking

### Excalidraw
- Type: Planning / whiteboard tool
- Use when: you want to sketch flows, page structure, app architecture, or rough concepts quickly
- Avoid when: you need high-fidelity design rather than rough thinking
- Quick note: especially good for brainstorming without getting perfectionistic too early

### Lighthouse
- Type: Browser audit tool
- Use when: you want a quick read on performance, accessibility, best practices, and SEO
- Avoid when: you need deep profiling rather than a high-level audit
- Quick note: good companion to Chrome DevTools Performance tab

### Can I Use
- Type: Compatibility reference
- Use when: you are using modern CSS or browser APIs and want to check support quickly
- Avoid when: the feature is already widely known and stable across modern browsers
- Quick note: helpful for avoiding browser-support surprises

### MDN
- Type: Core documentation/reference
- Use when: you want authoritative docs for HTML, CSS, JavaScript, browser APIs, and web platform features
- Avoid when: you only need project-specific library docs
- Quick note: one of the best long-term habits to build

### Accessibility Mindset
- Type: Quality practice
- Use when: always
- Quick note:
  - test keyboard navigation
  - check focus states
  - check color contrast
  - make interactive elements understandable
- Good for:
  - more professional UI
  - better usability
  - stronger frontend habits
