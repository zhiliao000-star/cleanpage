# CleanPage

Paste a link, extract its readable content, and get a clean shareable Markdown page.

## Screenshots

- Home page (placeholder)
- Clean page view (placeholder)

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite (MVP storage)
- jsdom + @mozilla/readability + turndown
- OpenNext Cloudflare + Wrangler

## Local Setup

```bash
git clone <repo>
cd cleanpage
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

App runs at `http://localhost:3000`.

## Environment Variables

| Name | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | Prisma SQLite URL, e.g. `file:./dev.db` |

## Database Setup

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Run & Build

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Cloudflare Deployment (Workers)

```bash
npm run cf:build
npm run cf:deploy
```

This repository includes `wrangler.toml` and OpenNext scripts for Cloudflare Workers.

> Note: this MVP uses SQLite for local development. For Cloudflare production persistence, migrate storage to Cloudflare D1 while keeping the same model shape.

## Future Roadmap

- Move persistence from SQLite to D1
- Add basic rate limiting
- Add metadata extraction preview
- Add optional refresh/versioning

## License

MIT
