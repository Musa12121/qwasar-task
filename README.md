# My Deployed App — Fullstack Blog

## Live app

**Render URL:** https://my-fullstack-blog-1xv9.onrender.com

**Health check:** `https://my-fullstack-blog-1xv9.onrender.com/api/health`

The health endpoint returns the app status, current timestamp, and server uptime.

## About the app

This is a fullstack blog with a React and TypeScript frontend and an Express and TypeScript backend. It supports registration and login, blog posts, image uploads, and admin features.

The production app is served from one Docker container. Express serves the built frontend and the API. PostgreSQL is hosted on Neon, and Prisma manages the database.

## Run locally with Docker

Prerequisites: Docker Desktop and a Neon PostgreSQL database.

From the repository root, enter the application directory and create a local environment file:

```powershell
cd my-deployed-app
Copy-Item .env.example server/.env
```

Edit `server/.env` and provide valid database connection strings and a private JWT secret. For Docker, set `NODE_ENV=production` and `PORT=3001`.

Build and run the container:

```powershell
docker build -f Dockerfile -t my-deployed-app .
docker run --rm --env-file server/.env -p 3001:3001 my-deployed-app
```

Open the app at [http://localhost:3001](http://localhost:3001). Check the health endpoint at [http://localhost:3001/api/health](http://localhost:3001/api/health).

Never commit `server/.env` or put real secrets in this README. Commit only `.env.example`.

## Environment variables

Set these in `server/.env` for local use and in Render’s Environment settings for deployment.

| Variable | Purpose |
| --- | --- |
| `PORT` | Server port. Use `3001` locally. Render provides its own port, so do not set this in Render. |
| `DATABASE_URL` | Neon pooled PostgreSQL connection string used by the app. |
| `DATABASE_URL_UNPOOLED` | Neon direct connection string used by Prisma for database operations such as migrations. |
| `JWT_SECRET` | Private random secret used to sign authentication tokens. |
| `NODE_ENV` | Use `development` locally and `production` on Render. |
| `CLIENT_URL` | Frontend origin allowed by the API’s CORS configuration. Use the local frontend URL for development and the Render app URL in production. |

Use the Neon **production** branch URLs in Render. Keep all passwords and secrets private.

## CI/CD and deployment

The GitHub Actions workflow is `.github/workflows/ci-cd.yml`. It runs on pushes and pull requests targeting `main`. It installs client dependencies, runs ESLint, builds the frontend, builds the Docker image, and starts the container to check `/api/health`.

There is no separate unit-test suite configured in this project yet; the container health check is the automated runtime check.

Render is connected to the GitHub repository and deploys commits from `main`. The production database schema is managed with Prisma migrations.

## Production readiness

- `GET /api/health` reports status, timestamp, and uptime.
- Pino provides structured HTTP request and error logging.
- Express serves the Vite production build from the same service as the API.
- The server handles `SIGTERM` and `SIGINT`, stops accepting requests, and disconnects Prisma.
- Production secrets are configured in Render and excluded from Git.

## What I learned

Shipping the blog taught me how Docker packages the frontend and backend for deployment, how GitHub Actions checks changes automatically, and how Render runs the container on the internet. I connected Prisma to a hosted PostgreSQL database, kept environment secrets out of source control, and added a health endpoint and structured logs so the deployed service is easier to check and debug.
