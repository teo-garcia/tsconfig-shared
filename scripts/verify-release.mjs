import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
)
const packageJson = JSON.parse(
  readFileSync(path.join(packageRoot, 'package.json'), 'utf8')
)
const tag =
  process.env.GITHUB_REF_NAME ??
  process.argv.slice(2).find((argument) => argument !== '--')
const expectedTag = `v${packageJson.version}`

if (!tag) {
  throw new Error('Release tag is required')
}

if (tag !== expectedTag) {
  throw new Error(`Release tag ${tag} does not match ${expectedTag}`)
}

console.log(`release tag ${tag} matches package version`)
