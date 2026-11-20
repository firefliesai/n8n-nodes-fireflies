# Working on this package

## Install and verify

Use Node.js 22 and npm, matching CI. Use `package-lock.json` for installs, not the older `pnpm-lock.yaml`.
Run these commands from the repository root:

```sh
npm ci
npm run build
npm run lint
npm test
.github/release-notes/check.sh
```

The build runs TypeScript and Gulp's `build:icons` task. A TypeScript-only build misses the icons.
There is no `n8n-node-dev` dependency. Generated `dist/` files are ignored; do not commit them.
Lint is check-only. Do not use the autofix or formatting scripts for verification.
Tests use mocked requests and a checked-in GraphQL schema, so no API key or running n8n instance is needed.
CI already runs the commands above on pull requests.

After building, smoke-check the compiled entry points and icon without credentials:

```sh
node -e 'const assert = require("node:assert/strict"); const fs = require("node:fs"); const p = require("./package.json"); for (const file of [...p.n8n.nodes, ...p.n8n.credentials]) { const Type = Object.values(require("./" + file))[0]; assert.ok(new Type().description || new Type().properties); } assert.ok(fs.existsSync("dist/nodes/Fireflies/fireflies.svg")); console.log("Node and credential modules load; icon exists");'
```

This checks module loading, not discovery in a running n8n editor or live API authentication.

## Edit and release

- Node code lives in `nodes/Fireflies/`, with separate `resources/`, `operations/`, and `helpers/` directories.
- Credentials live in `credentials/FirefliesApi.credentials.ts`. Keep API keys in n8n credentials, never in source, fixtures, or logs. Do not log meeting or user content.
- `package.json` lists the compiled node and credential paths under `n8n`. Keep those paths aligned with source changes.
- Do not bump the version for documentation-only changes. Merging a version bump to `main` triggers npm publication, then a tag and GitHub release.
- A version bump needs `.github/release-notes/<version>.md`. Follow [the release notes format](.github/release-notes/README.md). Do not publish manually as a verification step.
