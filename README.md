# Aviva website

Light-themed agency website built with Next.js, React, TypeScript, Inter, and Three.js.

## Local development

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The homepage is `/`; `/admin` is an unauthenticated design preview with demo data that resets when reloaded.

## Checks

```sh
npm run lint
npm run build
```

## Docker and xCloud

The production container listens on **4670**. See [DEPLOYMENT.md](DEPLOYMENT.md) for setup.

- `docker-compose.yml`: build and run from a complete source checkout.
- `docker-compose.xcloud.yml`: paste into xCloud after publishing the image and replacing its image-name placeholder.
- `npm run update:push -- username/aviva-site:latest`: build the Linux image and push it to your registry. Requires a running Docker engine and `docker login`.

The build downloads npm packages and the Inter font. Production images and fonts are committed under `public/`; local design exports and visual-QA artifacts are ignored.

Contact email addresses and external social links currently contain demo values. Update them for the live business before public launch.
