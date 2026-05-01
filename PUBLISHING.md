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
pnpm verify:package
pnpm verify:consumer
npm pack --dry-run
```

`pnpm verify:package` checks that:

- the package is named `@api7/better-auth-ui`
- `prepare` is not used for consumer installs
- `dist/index.js` preserves `"use client"`
- the public type exports used by API7 Developer Portal exist
- server-side view path exports exist
- all package export targets point to files included in `dist`

`pnpm verify:consumer` packs the package, installs the tarball in a temporary
consumer project, type-checks common imports, and verifies runtime exports.

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
