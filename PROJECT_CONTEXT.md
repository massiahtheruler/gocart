# Project Context

Use this file to align future chat sessions quickly.

## Project
- Name: GoCart
- Type: Multi-user / multi-vendor ecommerce web app
- Course / client / personal: Personal portfolio-quality build
- Current phase: strong UI foundation is in place; now moving from polished starter toward real full-stack product

## Goal
- What this project is supposed to achieve: turn the current storefront into a real multi-user marketplace where multiple sellers can manage stores and products, and customers can browse, cart, and purchase through a premium-feeling interface
- What "done" means: a deployable multi-vendor commerce app with real database-backed data, role-aware user flows, active UI states, and a cohesive premium frontend

## Design Direction
- Visual tone: minimal, premium, tactile, glassy, softly neumorphic, confident, showroom-like
- References / inspirations: modern luxury storefronts, museum/showroom product presentation, restrained motion, selective glassmorphism, subtle 3D moments
- What to avoid: dead buttons, noisy effects, generic starter-template feel, cluttered nav/footer areas, over-animated surfaces
- What should feel memorable: tactile controls, polished hover/press states, smooth scrolling, premium product presentation, a modern "window shopping with confidence" feeling

## Tech Stack
- Framework: Next.js App Router
- Styling: Tailwind CSS v4 plus custom CSS for higher-fidelity interactions and reusable effect classes
- Data / backend: PostgreSQL via Neon, Prisma, and a marketplace-oriented schema
- Auth: Clerk
- Deployment: likely Vercel

## Current Priorities
- 1. Turn the current polished UI into a more complete multi-user marketplace instead of a static starter.
- 2. Connect real backend/data flows for users, stores, products, carts, orders, and seller actions.
- 3. Keep refining the frontend so controls, routes, states, and motion all feel intentional.

## Known Issues
- Some parts of the app still behave like a starter rather than a real product.
- Some controls still need a route, action, or intentional disabled state.
- Footer/supporting sections still need refinement.
- Clerk dropdown styling currently uses structural CSS selectors and may be fragile across Clerk updates.
- The current Prisma setup is intentionally hybrid for repo stability:
  - Prisma 6.19.3
  - `prisma.config.ts` exists
  - `schema.prisma` still includes `url` and `directUrl`
  - `lib/prismadb.ts` uses the Neon adapter at runtime

## Notes For Chat
- Call the assistant `Chat`.
- What kind of collaboration is most helpful on this project: proactive product-building help, architecture guidance, implementation support, polish passes, and practical suggestions that preserve momentum
- Reminders to give automatically:
  - prefer current Next.js patterns because this repo uses a newer version
  - preserve the premium tactile feel while improving structure and usability
  - when a control is not functional yet, wire it up or give it an intentional disabled/not-allowed state
  - keep motion and glass effects selective and high-quality, not everywhere
  - remember this repo may be developed in a shell where `NODE_ENV=production`; installs may need `env -u NODE_ENV npm install` or `env -u NODE_ENV npm ci` so dev dependencies are included
- Things already decided so we do not keep re-deciding them:
  - this should become a real multi-user ecommerce platform
  - PostgreSQL/Neon is the database direction
  - the UI is a base, not the final product
  - motion, glassmorphism, tactile controls, smoother scrolling, and richer interactions are welcome when used intentionally
  - optimistic updates are desirable in the right areas
  - signed-in navbar direction is `UserButton` plus a `Store` CTA rather than cluttering the nav with too many auth actions
  - signed-in user menu should include `My Orders` and `Add account`
  - future seller flow should be:
    - `Add account` = quick route to create another store/account
    - `Store` = access/manage existing seller spaces, and later route to a store list/switcher when multiple stores exist

## Product / Feature Direction
- Multi-vendor marketplace with separate seller and customer experiences
- Real store creation and management flows
- Product management with database-backed records
- Order history and store dashboard direction
- More modal-driven interactions where they improve UX
- Cleaner footer and more polished supporting sections
- Active buttons, routes, and states across most of the interface
- Better micro-interactions and motion throughout the storefront

## System Map
- Frontend Pages
  - storefront pages: home, shop, product, cart, orders
  - seller pages: create-store, store dashboard, add/manage product, store orders
  - admin pages: stores, approve, coupons
- API Routes
  - store routes: create, product, dashboard, data, is-seller, stock-toggle
  - admin routes: stores, approve-store, is-admin
  - inngest route: event endpoint for background sync functions
- Services
  - Clerk = authentication and session state
  - Inngest = event-driven background jobs
  - ImageKit = image storage and delivery
  - Prisma = database access in code
  - PostgreSQL = relational database engine
  - Neon = hosted Postgres provider
- Main Data Flow
  - user signs in with Clerk
  - Clerk events are synced into Prisma user records via Inngest
  - seller submits store form to `/api/store/create`
  - store logo uploads to ImageKit
  - store/product/order data is stored through Prisma in Postgres on Neon
  - admin pages call admin APIs to review and approve stores
- Fast Mental Model
  - pages = what users see
  - API routes = what users trigger
  - Clerk = who the user is
  - Inngest = what happens automatically in the background
  - ImageKit = where images live
  - Prisma = how app code talks to the database
  - SQL = the language Postgres understands
  - PostgreSQL = the database engine
  - Neon = where that database is hosted

## Frontend Polish Wishlist
- Add more polished modals where useful
- Consider subtle card tilts as accents, not defaults everywhere
- Use glassmorphism selectively for featured surfaces
- Add smooth scrolling and stronger motion rhythm
- Consider Motion / Framer Motion style interactions for entrances, hover states, and section transitions
- Improve loading, disabled, empty, and optimistic states
- Keep Clerk/menu styling cohesive with the navbar, but revisit before deploy if structural CSS remains

## Pre-Deploy Notes
- Replace Clerk development keys with production keys before deploy.
- Recheck Clerk dropdown styling because current custom selectors target Clerk internals and may be brittle.
- Keep `DATABASE_URL` as the pooled Neon URL.
- Keep `DIRECT_URL` as the true direct Neon URL, not the `-pooler` host.
- Run `npx prisma generate` and `npm run build` before deploy.

## Post-Deploy Sanity Checklist
- Auth
  - Sign in works
  - Sign out works
  - `UserButton` menu renders correctly
  - `My Orders`, `Add account`, and `Store` route where expected
- Database
  - New users are present in the database
  - Store creation flows can read/write as expected
  - Prisma runtime works in production without client-generation errors
- Inngest
  - `/api/inngest` is reachable
  - Clerk user create/update/delete sync functions are registered and reachable
  - any future store-create event route is either implemented or intentionally left as a stub
- Env Vars
  - deployed `DATABASE_URL` uses Neon pooled URL
  - deployed `DIRECT_URL` uses Neon direct non-pooler URL
  - Clerk keys are production keys, not dev keys
  - Inngest event/signing keys are present in the deployed environment
- Dev / Placeholder Checks
  - no critical flows still depend on dummy data where production data is expected
  - no obvious dev-mode warnings remain that would affect launch confidence

## Useful Links / Notes
- Toolbox notes: `TOOLBOX_NOTES.md`
- Bookmark notes: `FRONTEND_BOOKMARKS.md`
- Repo instructions: `AGENTS.md`
- Roadmap: `ROADMAP.md`
- External notes: `/Users/christinemarquez/Developer-Notes/README.md`
- External toolbox: `/Users/christinemarquez/Developer-Notes/toolbox.md`
