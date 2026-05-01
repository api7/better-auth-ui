import { execFileSync } from "node:child_process"
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readdirSync,
    rmSync,
    writeFileSync
} from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const workDir = mkdtempSync(
    path.join(tmpdir(), "api7-better-auth-ui-consumer-")
)
const packDir = path.join(workDir, "pack")
const appDir = path.join(workDir, "app")

function run(command, args, options = {}) {
    execFileSync(command, args, {
        stdio: "inherit",
        ...options
    })
}

try {
    mkdirSync(packDir, { recursive: true })
    run("npm", ["pack", "--pack-destination", packDir], { cwd: root })

    const tarball = readdirSync(packDir)
        .filter((file) => file.endsWith(".tgz"))
        .map((file) => path.join(packDir, file))[0]

    if (!tarball || !existsSync(tarball)) {
        throw new Error("npm pack did not produce a tarball")
    }

    mkdirSync(appDir, { recursive: true })
    writeFileSync(
        path.join(appDir, "package.json"),
        JSON.stringify({ private: true, type: "module" }, null, 2)
    )
    writeFileSync(
        path.join(appDir, "tsconfig.json"),
        JSON.stringify(
            {
                compilerOptions: {
                    jsx: "react-jsx",
                    lib: ["dom", "dom.iterable", "esnext"],
                    module: "esnext",
                    moduleResolution: "bundler",
                    noEmit: true,
                    skipLibCheck: true,
                    strict: true,
                    target: "es2022"
                },
                include: ["src"]
            },
            null,
            2
        )
    )

    const sourceDir = path.join(appDir, "src")
    mkdirSync(sourceDir, { recursive: true })
    writeFileSync(
        path.join(sourceDir, "index.tsx"),
        `import { AuthUIProvider, AuthView, OrganizationSwitcher, UserButton, UserInvitationsCard, type Provider } from "@api7/better-auth-ui"
import { accountViewPaths, organizationViewPaths } from "@api7/better-auth-ui/server"

const provider: Provider = { provider: "api7", name: "API7" }
const refs = [
    AuthUIProvider,
    AuthView,
    OrganizationSwitcher,
    UserButton,
    UserInvitationsCard,
    accountViewPaths.SETTINGS,
    organizationViewPaths.MEMBERS,
    provider.name
]

console.log(refs.length)
`
    )

    run(
        "npm",
        [
            "install",
            "--silent",
            tarball,
            "typescript@5.9.3",
            "react@18.3.1",
            "react-dom@18.3.1",
            "@types/react@18.3.3",
            "@types/react-dom@18.3.0"
        ],
        { cwd: appDir }
    )
    run("npx", ["tsc", "--noEmit"], { cwd: appDir })

    const runtimeCheck = `const ui = await import("@api7/better-auth-ui")
const server = await import("@api7/better-auth-ui/server")
for (const name of ["AuthUIProvider", "AuthView", "OrganizationView", "OrganizationSwitcher", "UserButton", "UserInvitationsCard"]) {
    if (!(name in ui)) throw new Error("Missing runtime export: " + name)
}
for (const name of ["accountViewPaths", "organizationViewPaths"]) {
    if (!(name in server)) throw new Error("Missing server runtime export: " + name)
}
`
    writeFileSync(path.join(appDir, "runtime-check.mjs"), runtimeCheck)
    run("node", ["runtime-check.mjs"], { cwd: appDir })

    console.log("Consumer verification passed")
} finally {
    rmSync(workDir, { recursive: true, force: true })
}
