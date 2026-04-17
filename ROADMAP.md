# GoCart Roadmap

This roadmap turns the current UI-heavy starter into a real multi-user, multi-vendor ecommerce product without losing the premium feel that already makes the frontend strong.

## North Star

Build GoCart into a polished marketplace where:
- customers can browse, save, cart, and order smoothly
- sellers can create and manage stores, products, and orders
- admins can approve stores and oversee platform health
- the UI feels premium, animated, intentional, and mostly free of dead controls

## Current Reality

What already exists:
- Next.js app structure for public, store, and admin areas
- Redux slices for cart, address, product, and rating state
- Prisma schema already pointed at PostgreSQL
- a strong visual base with reusable storefront components

What still feels starter-like:
- some controls are likely not wired yet
- interactions, disabled states, and routes need polish
- architecture is not fully connected end-to-end
- footer and supporting sections need refinement
- there are two root layout files, and the TypeScript one is currently not ready to be the source of truth

## Build Order

## Phase 1: Stabilize The Base

Goal: make the current app safe to build on.

Tasks:
- choose one root layout and remove the confusing duplicate layout situation
- confirm auth direction with Clerk and define roles: customer, seller, admin
- clean up route structure for public, seller dashboard, and admin dashboard
- audit all major buttons, links, and CTAs
- for each control: wire it to a route/action or give it an intentional disabled state with `cursor-not-allowed`
- clean the footer and make it feel complete, useful, and styled to match the rest of the site
- identify placeholder sections that should be real, hidden, or redesigned

Definition of done:
- no ambiguous root layout setup
- primary navigation and major CTAs behave intentionally
- no obviously dead buttons on key pages

## Phase 2: Lock The Product Model

Goal: finalize the marketplace data shape before deeper feature work.

Tasks:
- refine Prisma schema around the real product vision
- confirm whether a user can own one store or multiple stores
- decide whether cart stays as JSON on `User` or becomes normalized `Cart` and `CartItem` tables
- add clearer role/status fields where needed
- review whether coupons should relate to stores, users, or platform-wide rules
- plan inventory behavior, product variants, and image handling
- define order lifecycle and payment states more explicitly

Recommended direction:
- keep PostgreSQL + Prisma with Next.js instead of trying to force a separate PERN architecture
- treat this as a full-stack Next app with Postgres, server routes/actions, and role-based dashboards

Definition of done:
- schema supports customer, seller, admin, store, product, cart, order, review, and coupon flows cleanly
- no major feature depends on a temporary data model you already expect to replace

## Phase 3: Connect Real Backend Flows

Goal: move from demo UI to real data-backed behavior.

Tasks:
- connect Clerk user identity to app user records
- create onboarding flow for store creation and approval
- connect product list/detail pages to database-backed products
- connect cart behavior to persistent storage
- connect address flow and order creation
- connect seller product management to real mutations
- connect admin approval pages to real store moderation actions

Definition of done:
- core pages read and write real data
- seller and admin actions change actual records
- refresh does not wipe important user flows like cart or store state

## Phase 4: UX Completeness Pass

Goal: make the app feel finished, not just functional.

Tasks:
- add empty states, loading states, error states, and success feedback
- improve modal usage where it reduces page friction
- add clearer disabled states for unavailable actions
- improve toasts and inline validation
- make search, filtering, and sorting feel responsive
- improve account/store/order feedback loops

High-value areas:
- cart updates
- order placement
- product management
- store approval
- address entry
- reviews/ratings

Definition of done:
- the app communicates state clearly
- users are rarely left wondering whether something worked

## Phase 5: Motion And Visual Polish

Goal: push the premium frontend identity further without making it gimmicky.

Tasks:
- introduce Motion for entrance animations, hover states, modal transitions, and section reveals
- add smooth scrolling intentionally, especially on public/storefront pages
- use glassmorphism for featured surfaces, overlays, or cards where contrast stays strong
- add subtle tilt effects only on select hero/featured cards
- create a consistent motion language for hover, press, reveal, and page transition behavior
- improve section pacing and visual rhythm across landing and shop pages

Guardrails:
- do not animate every element
- keep text readable and interactions fast
- prefer a few signature motions over constant movement

Definition of done:
- motion feels designed, not sprayed on
- storefront pages feel noticeably more premium and modern

## Phase 6: Optimistic And Instant-Feeling Interactions

Goal: make the product feel fast.

Best candidates for optimistic updates:
- add/remove cart item
- quantity changes
- wishlist/save actions if added
- store approval toggles in admin
- product availability toggles in seller dashboard
- rating/review submission where safe

Notes:
- pair optimistic UI with rollback/error handling
- use optimistic behavior only where failure recovery is clear

Definition of done:
- common interactions feel immediate
- backend latency is less visible to the user

## Phase 7: Commerce Depth

Goal: expand beyond the starter marketplace basics.

Potential additions:
- wishlist/saved items
- product variants like size/color
- seller analytics improvements
- shipping settings
- store theming/customization
- richer coupon logic
- payment provider integration beyond placeholder flows
- notifications/email flows

## Suggested Technical Direction

Recommended stack path from here:
- frontend/app framework: Next.js App Router
- database: PostgreSQL
- ORM: Prisma
- auth: Clerk
- state: Redux where already useful, but prefer server-backed state for persistent commerce data
- async/server state: consider adding SWR or TanStack Query later if data fetching complexity grows
- animation: Motion first, GSAP only for more choreographed sequences

## Immediate Next Sprint

If we want the highest-value order, do this next:

1. Clean root layout duplication and settle app shell ownership.
2. Audit and wire major buttons/routes, or mark them intentionally unavailable.
3. Refine Prisma schema around real marketplace requirements.
4. Connect auth roles and store onboarding flow.
5. Improve footer and shared layout polish.
6. Add first-pass motion and smooth-scroll polish to the public experience.

## Nice-To-Have Soon

- unify button patterns and disabled styles into reusable components
- add a shared modal system
- add reusable empty/loading/error UI patterns
- create a design token layer for glass, shadows, radius, and motion timing

## Risks To Watch

- overbuilding visual effects before core data flows are real
- letting Redux hold data that should live in the database
- mixing too many UI styles or motion patterns
- postponing role/permissions design until after dashboards are already built
- keeping placeholder routes/buttons too long and creating confusion

## How Chat Should Help

Best collaboration mode for this project:
- make concrete improvements, not just abstract suggestions
- keep the premium UI feel while tightening product structure
- flag when architecture choices will create rework later
- prefer intentional incomplete states over fake functionality
- preserve momentum by shipping in vertical slices
