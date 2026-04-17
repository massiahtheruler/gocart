<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Prisma / Vercel Troubleshooting

- If Vercel shows broad `500` errors across multiple API routes like `/api/users`, `/api/current`, `/api/auth/providers`, `/api/auth/session`, or `/api/register`, check Prisma client generation before assuming the frontend or auth flow is broken.
- In this project, a real production failure was: `@prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.`
- Required fixes for this repo:
  - `prisma/schema.prisma` must include `url = env("DATABASE_URL")` in the `datasource db` block.
  - `package.json` must keep `"postinstall": "prisma generate"` so Vercel generates Prisma Client during install.
  - `libs/prismadb.ts` reads `process.env.DATABASE_URL` at runtime when creating `PrismaClient`.
- Before blaming sign-in specifically, test:
  - `/api/auth/providers`
  - `/api/current`
  - `/api/users`
  If all of them fail, treat it as a shared backend/Prisma issue.
- If Prisma prompts about Prisma 7 not supporting datasource URLs in the schema, keep this workspace on Prisma 6 for now. Do not upgrade Prisma versions during deploy debugging unless explicitly intended.
