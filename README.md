# PlusOneThree Careers

Careers application site for PlusOneThree. Applicants submit the form on this frontend; a Cloudflare Worker validates the payload, stores it in Supabase, and sends notification emails via Resend.

**Live site:** https://plusonethree-careers.pages.dev

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| API | Cloudflare Worker (`plusonethree-careers`) |
| Database | Supabase (`career_applications`) |
| Email | Resend |

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_CAREERS_API_URL` in `.env` to the careers Worker URL (see `.env.example`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Deployment

Deployments run through **GitHub Actions only** on push to `main`.

Workflow: `.github/workflows/deploy-pages.yml`

1. Install dependencies and build with `VITE_CAREERS_API_URL`
2. Deploy `dist/` to Cloudflare Pages project `plusonethree-careers`

### Required GitHub secrets

Add these to the **`CLOUDFLARE_TOKENS`** environment (Settings → Environments → CLOUDFLARE_TOKENS → Environment secrets), or as repository secrets:

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with **Account → Cloudflare Pages → Edit** |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

The deploy workflow uses `environment: CLOUDFLARE_TOKENS`.

Do **not** enable Cloudflare Pages native Git builds with a custom `wrangler deploy` command — use GitHub Actions instead.

### Manual deploy (optional)

```bash
npm run build
npx wrangler pages deploy dist --project-name=plusonethree-careers
```

Requires Wrangler auth locally (`CLOUDFLARE_API_TOKEN` env var or `wrangler login`).

## Related repos

- **Frontend:** [plusonethreeadmin-pixel/Careers-plusonethree](https://github.com/plusonethreeadmin-pixel/Careers-plusonethree)
- **Worker:** `careers-worker/` in the PlusOn monorepo (`plusonethree-careers` on Cloudflare)

## License

Private — PlusOneThree.
