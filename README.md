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

Add valid database URLs and a JWT secret to `server/.env`, then run:

```powershell
docker build -t my-deployed-app .
docker run --rm --env-file server/.env -e NODE_ENV=production -p 3001:3001 my-deployed-app
```

Open http://localhost:3001.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Server port; use `3001` locally. Render sets this automatically. |
| `DATABASE_URL` | Pooled Neon PostgreSQL connection string. |
| `DATABASE_URL_UNPOOLED` | Direct Neon connection string for Prisma migrations. |
| `JWT_SECRET` | Secret used to sign authentication tokens. |
| `NODE_ENV` | App mode: `development` or `production`. |
| `CLIENT_URL` | Frontend URL allowed by the API CORS settings. |
| `VITE_API_URL` | API URL used by the client. |

## CI/CD

The GitHub Actions workflow runs on pushes and pull requests to `main`. It lints and builds the client, builds the Docker image, and checks the container health endpoint. Render deploys updates from the connected GitHub branch.

## What I learned

I learned to package a fullstack app with Docker, check changes with GitHub Actions, configure production environment variables, and deploy an app connected to a hosted PostgreSQL database.
