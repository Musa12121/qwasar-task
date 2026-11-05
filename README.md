# My Deployed App

## Live URL

https://my-fullstack-blog-1xv9.onrender.com

Health check: https://my-fullstack-blog-1xv9.onrender.com/api/health

## Run locally with Docker

From the repository root:

```powershell
cd my-deployed-app
Copy-Item .env.example server/.env
```

Use unquoted values in `server/.env` because Docker reads it with `--env-file`.

Add valid database URLs and a JWT secret to `server/.env`, then run:

```powershell
docker build -t my-deployed-app .
docker run --rm --env-file server/.env -e NODE_ENV=production -p 3001:3001 my-deployed-app
```

Open http://localhost:3001.

## Environment variables

Server variables go in `server/.env`. Put `VITE_API_URL` in
`client/.env` and `RENDER_DEPLOY_HOOK_URL` in GitHub Actions secrets.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | None | Pooled PostgreSQL connection |
| `DATABASE_URL_UNPOOLED` | For Prisma CLI | None | Direct database connection |
| `JWT_SECRET` | Yes | None | Signs authentication tokens |
| `PORT` | No | `3001` | Server port; Render supplies its own |
| `NODE_ENV` | No | `development` | Docker sets this to `production` |
| `CLIENT_URL` | No | `http://localhost:5173` | Allowed frontend origin |
| `VITE_API_URL` | No | Same origin | Set to `http://localhost:3001` for frontend development |
| `RENDER_DEPLOY_HOOK_URL` | For deployment | None | Triggers Render from GitHub Actions |

## CI/CD

GitHub Actions runs three jobs:

1. Lint and Test: lints both apps, tests the health endpoint, and builds the frontend.
2. Build Docker Image: builds the production image after checks pass.
3. Deploy: triggers Render for the checked commit on pushes to `main`.

Pull requests to `main` run the first two jobs. Render Auto-Deploy is off;
the workflow deploys using the `RENDER_DEPLOY_HOOK_URL` secret.

## Monitoring

Render and UptimeRobot check `/api/health`. UptimeRobot checks every
five minutes and sends downtime alerts by email.

The endpoint reports database connectivity, uptime, version, and memory
usage. It returns `503` if the database is unavailable or JavaScript heap
usage exceeds 80% of its limit. High memory usage also produces a warning log.

Render forwards application logs to Better Stack. An email alert fires
when five or more HTTP `500` responses occur within five minutes.
It checks every minute and resolves after the count stays below five
for one minute.

## Database migrations

From `my-deployed-app/server`, apply committed migrations with:

```bash
npx prisma migrate deploy
```

## What I learned

I learned to package a fullstack app with Docker, check changes with GitHub Actions, configure production environment variables, and deploy an app connected to a hosted PostgreSQL database.
