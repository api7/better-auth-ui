# Publishing `@api7/better-auth-ui`

This fork is published as `@api7/better-auth-ui` so API7 projects can depend on
a prebuilt npm package instead of rebuilding this repository during consumer
installation.

## Versioning

Use the upstream version plus an API7 suffix:

```text
3.3.15-api7.0
3.3.15-api7.1
3.4.0-api7.0
```

Increment the API7 suffix for fork-only fixes. Move the upstream base version
when rebasing onto a newer upstream release.

## Release Checks

Run these commands before publishing:

```bash
pnpm install --frozen-lockfile
pnpm build
npm pack --dry-run
```

`npm pack --dry-run` runs `prepack`, which rebuilds `dist` and shows the files
that will be included in the published tarball.

## Automated Release

This repository publishes the npm package from GitHub Actions with the same
manual release boundary used by `api7/portal-sdk-typescript`: the `Release`
workflow is started with `workflow_dispatch`, defaults to a dry run, and uses
npm Trusted Publishing/OIDC. Do not add a token-based fallback path.

Before running the workflow, configure npm Trusted Publishing for:

- package: `@api7/better-auth-ui`
- owner: `api7`
- repository: `better-auth-ui`
- workflow filename: `release.yaml`

Then run the `Release` workflow manually from the `main` branch:

- `dry_run`: `true` first
- `dry_run`: `false` after the dry run succeeds

The release workflow installs dependencies, verifies that the package version
has not already been published, verifies that the workflow is running from the
current `origin/main` commit, runs `npm pack --dry-run`, and publishes to npm
with provenance.

Because this repository intentionally uses a single Trusted Publishing path, the
npm package must be ready for Trusted Publishing before the first non-dry-run
release. If npm cannot configure Trusted Publishing for a never-published
package, an API7 npm administrator must bootstrap the package outside this
repository; do not add an `NPM_TOKEN` fallback here.

Do not restore a `prepare` script for this package. Consumers should install the
prebuilt npm tarball rather than rebuilding the GitHub repository during their
own install step.

## Portal Dependency

API7 Developer Portal can keep existing source imports while installing the API7
package through an npm alias:

```json
{
  "dependencies": {
    "@daveyplate/better-auth-ui": "npm:@api7/better-auth-ui@3.3.15-api7.0"
  }
}
```
