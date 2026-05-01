import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const failures = []

function fail(message) {
    failures.push(message)
}

function readJson(relativePath) {
    return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"))
}

function readText(relativePath) {
    return readFileSync(path.join(root, relativePath), "utf8")
}

function assertFile(relativePath) {
    if (!existsSync(path.join(root, relativePath))) {
        fail(`Missing required file: ${relativePath}`)
    }
}

function assertContains(relativePath, values) {
    const content = readText(relativePath)
    for (const value of values) {
        if (!content.includes(value)) {
            fail(`${relativePath} does not contain ${value}`)
        }
    }
}

function collectExportTargets(value, targets = []) {
    if (typeof value === "string") {
        targets.push(value)
        return targets
    }

    if (value && typeof value === "object") {
        for (const nested of Object.values(value)) {
            collectExportTargets(nested, targets)
        }
    }

    return targets
}

const pkg = readJson("package.json")

if (pkg.name !== "@api7/better-auth-ui") {
    fail(`Expected package name @api7/better-auth-ui, got ${pkg.name}`)
}

if (!/^\d+\.\d+\.\d+-api7\.\d+$/.test(pkg.version)) {
    fail(`Expected version like 3.3.15-api7.0, got ${pkg.version}`)
}

if (pkg.scripts?.prepare) {
    fail("The prepare script must not be used for consumer installs")
}

if (!pkg.publishConfig || pkg.publishConfig.access !== "public") {
    fail("publishConfig.access must be public")
}

if (!pkg.files?.includes("dist")) {
    fail("files must include dist")
}

if (pkg.files?.includes("src")) {
    fail("files must not include src")
}

for (const relativePath of [
    "dist/index.js",
    "dist/index.cjs",
    "dist/index.d.ts",
    "dist/index.d.cts",
    "dist/server.js",
    "dist/server.cjs",
    "dist/server.d.ts",
    "dist/server.d.cts",
    "dist/style.css"
]) {
    assertFile(relativePath)
}

for (const target of collectExportTargets(pkg.exports)) {
    assertFile(target.replace(/^\.\//, ""))
}

const indexJs = readText("dist/index.js").trimStart()
if (
    !indexJs.startsWith('"use client"') &&
    !indexJs.startsWith("'use client'")
) {
    fail("dist/index.js must preserve the use client directive")
}

assertContains("dist/index.d.ts", [
    "AuthUIProvider",
    "AuthView",
    "OrganizationView",
    "OrganizationSwitcher",
    "UserButton",
    "UserInvitationsCard",
    "Provider"
])

assertContains("dist/server.d.ts", [
    "accountViewPaths",
    "organizationViewPaths"
])

if (failures.length > 0) {
    console.error("Package verification failed:")
    for (const failure of failures) {
        console.error(`- ${failure}`)
    }
    process.exit(1)
}

console.log("Package verification passed")
