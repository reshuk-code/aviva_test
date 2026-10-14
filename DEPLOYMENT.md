# xCloud: paste Docker Compose

Pasting Compose does not upload source code. Use `docker-compose.xcloud.yml`, which pulls a previously published image.

1. Start Docker Desktop with its Linux engine.
2. Sign in with `docker login`.
3. Build and publish: `npm run update:push -- YOUR_DOCKERHUB_USERNAME/aviva-site:latest` (replace the username).
4. Replace the image name in `docker-compose.xcloud.yml` with that same published name.
5. Paste the file contents into xCloud and select application port **4670**.

xCloud must be able to pull the image: use a public repository or configure registry credentials on the deployment server. The script defaults to `linux/amd64`; set `DOCKER_PLATFORM` if your server uses a different architecture. Alternatively set `DOCKER_IMAGE` to avoid passing the image name each time.

For updates, run the same build-and-push command, then redeploy in xCloud. `pull_policy: always` requests the updated image.

The separate `docker-compose.yml` is for a host with the full source checkout: `docker compose up -d --build`.

The build needs network access for npm and the Inter font. The container runs the Next.js standalone server as a non-root user on `0.0.0.0:4670`. ## Backend (Neon + admin CMS)

Content, inquiries and settings live in a Neon Postgres database (project `aviva-site`, region Singapore). Images uploaded in the admin are stored in Neon Object Storage, in the public-read bucket `aviva-media` on the same branch. The container keeps no files of its own, so no volume is needed. Set these environment variables in xCloud (or in a `.env` file next to `docker-compose.yml`):

- `DATABASE_URL`: the Neon connection string (pooled).
- `AUTH_SECRET`: a random string of at least 32 characters, used to sign admin sessions. Changing it signs everyone out.
- `STORAGE_ENDPOINT`, `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`: the branch storage endpoint and a Neon credential with `storage:read` and `storage:write` scopes (Neon Console → Settings → Credentials). `STORAGE_REGION` defaults to `ap-southeast-1` and `STORAGE_BUCKET` to `aviva-media`.
- Optional `SITE_URL`: the public address (for example `https://avivanepal.com`). It can also be set in Admin → Settings.

Local development reads them from `.env.local` (git-ignored).

- `npm run db:setup` creates or updates the tables and seeds an empty database. It is safe to run again.
- `npm run media:migrate` moves any library images still served from `public/images` into Neon storage and updates the content that uses them. It shows a dry run first; add `-- --apply` to run it. Safe to repeat.
- `npm run admin:create -- you@example.com "Your Name"` creates an admin or resets a password (prompts for it).

The admin is at `/admin`: pages, services, projects, blog posts, team, media library, inquiries and settings, with SEO fields on everything. It also serves `/sitemap.xml` and `/robots.txt` automatically.

Reference: https://xcloud.host/docs/how-to-deploy-custom-docker-with-xcloud/
