# GoCart

GoCart is a full-stack, multi-vendor ecommerce platform built to feel like a real product. It combines customer shopping flows, seller tools, admin controls, payments, reviews, coupons, account-aware UI, and a custom premium visual system into one project.

I approached this project like a marketplace product build rather than a basic storefront. The goal was not just to render products, but to build a complete experience with multiple account types, store approval flow, dashboard logic, dark mode, functional checkout, scheduled coupons, review systems, AI-assisted product creation, and a front-end that feels intentional.

One of the things I’m most proud of in this project is that the interaction design and visual effects were not borrowed from GSAP snippets, Framer templates, or drag-and-drop UI builders. The glass, neumorphic, showroom-style surfaces, hover states, motion, layered glows, and state-driven UI behavior were built directly in the app with CSS, Tailwind, React, and component logic. Tailwind in particular became a big part of how I shaped the visual system, because it let me build and refine a custom component language instead of relying on pre-made themes or template styling.

## Live Demo

`https://gocart-beta-one.vercel.app`

## Core Features

- Multi-vendor ecommerce platform with customer, seller, and admin experiences
- Real sign up / sign in flow with account-aware rendering and protected actions
- Seller store creation, approval workflow, and store management tools
- Product creation, editing, stock toggling, image galleries, and multi-category support
- AI-assisted product description flow for faster seller listing creation
- Functional cart, checkout, COD flow, and Stripe payment integration
- Public deals page with active, upcoming, and expired coupon campaigns
- Coupon scheduling, saved deals, checkout coupon application, and validation
- Buyer and seller order flows with status tracking and bulk seller updates
- Delivered-order review system with editable ratings and a public reviews page
- Admin dashboards for stores, approvals, reviews, and coupon campaigns
- Dark mode plus a custom premium glass / neumorphic / showroom-inspired design system
- Fully customized motion, hover, parallax, and surface effects built from scratch

## Architecture Snapshot

Frontend:
- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Redux Toolkit

Backend and Data:
- Prisma ORM
- Neon Postgres
- Clerk authentication
- Next.js API routes

Commerce and Services:
- Stripe Checkout and webhook handling
- ImageKit media upload flow
- Inngest event scheduling
- OpenAI-compatible / Gemini-based AI listing support

## Demo Accounts

### Customer

- Name: `Massiah TheRuler`
- Email: `kingmassiah124@gmail.com`
- Password: `random123!321`
- Can browse products, save cart items, apply coupons, place orders, and leave reviews on delivered purchases

### Seller Application Pending

- Name: `Justin Henry`
- Email: `justin.henry124@gmail.com`
- Password: `random123!321`
- Current state: submitted for store approval
- Can be used to verify seller onboarding and pending-store account behavior

## What I Built

### 1. Marketplace Structure, Not Just a Storefront
This project supports multiple roles and multiple experiences inside the same app.

That includes:
- customer browsing and checkout
- seller store creation and management
- admin approval and moderation tools
- role-aware routes and UI states
- vendor-specific dashboards and storefronts

I wanted it to behave like an actual platform, not just a one-account demo store.

### 2. Real Account Flow and Protected Commerce Actions
I built account-aware behavior throughout the app instead of treating auth like a decorative add-on.

That includes:
- sign up and sign in with Clerk
- protected cart, coupon, review, and checkout actions
- conditional navbar actions depending on user role
- admin and seller gating
- state-based renders for guests vs signed-in users

This makes the app feel like a real product with rules, not a static UI shell.

### 3. Multi-Vendor Seller Experience
Sellers can do more than upload one product and stop there.

That includes:
- create-store flow
- admin approval before a store goes live
- seller dashboard stats
- product add / edit / stock toggle
- product image gallery support
- multi-category product placement
- seller order management
- bulk order status updates
- seller review management

One of the most important parts of this project was turning the seller side into something that actually feels usable.

### 4. Product System and Listing Depth
I expanded the product layer so listings feel richer and more flexible.

That includes:
- multiple product images
- product descriptions
- category and custom category support
- price, MRP, stock state, and ratings
- related products
- shop sorting and filtering
- store-specific shop filtering

I also fixed edit behavior so changing one product image doesn’t wipe out the rest of the gallery, which is the kind of detail that matters in a real app.

### 5. Functional Checkout and Payment Flow
This is not a fake cart.

That includes:
- persistent cart flow
- saved address handling
- cash on delivery
- Stripe Checkout integration
- order creation
- order history
- payment method and paid-state visibility
- seller-side fulfillment status flow

I also handled the less glamorous parts like coupon validation rules, date windows, and status synchronization instead of just wiring a “Pay” button and calling it done.

### 6. Coupons, Campaigns, and Deals
The coupon system became much more than a single promo-code field.

That includes:
- public deals page
- active, upcoming, and expired campaign visibility
- scheduled coupon start dates
- inclusive end-date handling
- checkout validation
- selected deal persistence while browsing
- visible saved-deal banners in cart and checkout
- admin coupon creation with timing controls

I wanted deals to feel like a real campaign system with urgency and discoverability, not just an admin-only hidden code.

### 7. Reviews and Ratings with Real Logic
I built reviews around actual delivered purchases instead of allowing random fake rating spam.

That includes:
- delivered-order review gating
- rating modal flow
- editable reviews
- review count and rating display on products
- public reviews page
- seller review view
- admin review oversight

This gave the catalog more credibility and made the sort/filter features more meaningful.

### 8. AI-Assisted Seller Flow
I added AI product assistance as an actual seller feature, not just as a demo talking point.

That includes:
- AI-backed product description / listing support
- image-driven product generation flow
- structured parsing and validation work so the feature behaves predictably

This was one of the clearest product-level additions because it changes the seller workflow in a useful way.

### 9. Custom UI Direction and Interaction Design
The front-end is one of the biggest ways this project became mine.

That includes:
- glass / neumorphic surfaces
- luxury showroom-inspired product presentation
- custom hover glows and layered shadows
- hero parallax and tactile card behavior
- dark mode
- responsive nav changes by breakpoint
- dynamic state-determined CTAs
- premium filters, pills, badges, and motion

I wanted the experience to feel modern, tactile, and curated instead of generic ecommerce boilerplate.

## Built Beyond the Expected Scope

This project went well beyond the baseline marketplace feature set and expected scope asked of me or what I originally planned for it.

I expanded it by:
- designing a fully custom visual system instead of settling for stock ecommerce styling
- building real customer, seller, and admin flows
- adding scheduled coupons and a public deals ecosystem
- implementing review and rating systems with real restrictions
- adding Stripe payment handling
- adding AI-assisted product creation
- rebuilding and polishing dashboards, orders, and shop filters
- fixing logic regressions and deployment issues instead of avoiding them
- adapting the app to a modern Next.js + Prisma + Clerk stack while keeping the UX polished

The result is much closer to a portfolio product build than a simple demo app.

## Technical Notes

This app was built around real state, real data, and real route behavior.

Key technical areas include:
- Next.js App Router architecture
- client/server component boundaries
- Clerk authentication
- Redux Toolkit state management
- Prisma ORM with Neon Postgres
- Stripe Checkout and webhook flow
- ImageKit media upload handling
- Inngest event scheduling
- AI route integration through an OpenAI-compatible API surface
- role-aware rendering and protected actions
- responsive, state-driven UI logic
- Tailwind-driven component styling and custom interaction design

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Clerk
- Prisma
- Neon Postgres
- Redux Toolkit
- Stripe
- ImageKit
- Inngest
- Axios
- Lucide React
- Recharts
- OpenAI-compatible / Gemini-based AI integration

## Why This Project Stands Out

What makes GoCart stronger than a standard portfolio marketplace build is the combination of:

- multiple real account types
- seller and admin capabilities
- payment and coupon systems that actually work
- reviews tied to delivered orders
- AI-assisted listing support
- visible product thinking beyond the base ecommerce feature set
- a custom visual identity and interaction language
- deeper debugging and deployment discipline than a normal clone project

This project shows that I can do more than replicate a layout. It shows that I can:

- take a broad product idea and turn it into a more complete, more intentional application
- make UX and product decisions, not just styling decisions
- solve backend and schema issues when features get more complex
- build richer role-aware behavior across one app
- create polished front-end effects from scratch using CSS and Tailwind instead of relying on motion libraries or prefab templates

## Running the Project

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Prisma Schema Sync

If you pull schema changes, especially around coupons or other database-backed features, sync Prisma before testing or deploying:

```bash
npx prisma db push
npx prisma generate
```

This repo also relies on Prisma Client generation during install for deployment, so the `postinstall` script should remain intact.

## Future Improvements

- seller-scoped coupon creation and eligibility rules
- richer analytics for sellers and admins
- stronger AI output validation and listing workflows
- product comparison flow
- more advanced recommendation logic
- shipping and fulfillment depth beyond the current status system

## Closing

GoCart reflects the kind of work I want to keep doing: product-focused front-end and full-stack engineering, strong UI polish, real account-aware behavior, custom interaction design, and the willingness to keep pushing a project until it feels finished, intentional, and portfolio-worthy.
