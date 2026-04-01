# CleanPage

CleanPage is a small MVP that turns a noisy article URL into a clean, shareable Markdown page.

## Stack

- Next.js 16 App Router + TypeScript
- Tailwind CSS 4
- Prisma + SQLite
- `cheerio` + `turndown` for extraction and Markdown conversion
- `turndown` for Markdown conversion
- Cloudflare Workers deployment via OpenNext

## Features

- Home page with URL input, one-click clean flow, and sample links
- Server-side extraction pipeline with URL validation and friendly errors
- Cryptographically strong 5-letter public IDs with collision retries
- Saved cleaned pages at `/[id]`
- Markdown rendering plus copy-markdown and copy-share-link buttons
- SQLite persistence through Prisma
- Cloudflare-ready config (`wrangler.toml` + `open-next.config.ts`)

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Generate Prisma client and create the SQLite database:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open <http://localhost:3000>

## Scripts

- `npm run dev` – start the development server
- `npm run build` – production Next.js build
- `npm run start` – run the built app locally
- `npm run lint` – ESLint
- `npm run prisma:generate` – generate Prisma client
- `npm run prisma:migrate` – create/apply the local SQLite migration
- `npm run cf:build` – build for Cloudflare Workers using OpenNext
- `npm run cf:preview` – preview the built worker locally with Wrangler
- `npm run cf:deploy` – deploy to Cloudflare Workers

## Cloudflare Workers deployment

1. Authenticate Wrangler:

   ```bash
   npx wrangler login
   ```

2. Optionally set your production site URL so share-link copies use the full domain:

   ```bash
   NEXT_PUBLIC_SITE_URL="https://your-domain.example"
   ```

3. Build the worker bundle:

   ```bash
   npm run cf:build
   ```

4. Deploy:

   ```bash
   npm run cf:deploy
   ```

### Notes

- The default local database is `./dev.db`.
- For production on Cloudflare, replace local SQLite with a durable remote database before real traffic.
- No Vercel-specific files or instructions are included.

## Project structure

```text
app/
  [id]/page.tsx        Cleaned page view
  actions.ts           Server action for URL submission
  page.tsx             Home page
components/
  clean-form.tsx       URL form + error display
  copy-button.tsx      Clipboard buttons
lib/
  clean.ts             Extraction + persistence pipeline
  prisma.ts            Prisma client singleton
  utils.ts             URL validation + secure ID generation
prisma/
  schema.prisma        Database schema
wrangler.toml          Cloudflare Workers config
open-next.config.ts    OpenNext Cloudflare config
```

## License

MIT
