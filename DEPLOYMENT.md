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

The build needs network access for npm and the Inter font. The container runs the Next.js standalone server as a non-root user on `0.0.0.0:4670`. The admin remains an unauthenticated design preview with session-only demo data.

Reference: https://xcloud.host/docs/how-to-deploy-custom-docker-with-xcloud/
