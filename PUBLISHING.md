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

This repository publishes the npm package from GitHub Actions when a version tag
is pushed, following the same tag-triggered release boundary used by
`api7/adc`.

Before creating a tag, configure npm Trusted Publishing for:

- package: `@api7/better-auth-ui`
- owner: `api7`
- repository: `better-auth-ui`
- workflow: `.github/workflows/release.yaml`

The tag must match `package.json` exactly:

```bash
git tag v3.3.15-api7.0
git push origin v3.3.15-api7.0
```

The release workflow installs dependencies, verifies that the tag version
matches `package.json`, checks that the package version is not already
published, runs `npm pack --dry-run`, and publishes to npm.

## Publish

Make sure you are logged in with permission to publish under the `@api7` scope:

```bash
npm whoami
npm publish --access public
```

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
