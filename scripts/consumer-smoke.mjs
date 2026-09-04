import { execFileSync } from 'node:child_process'
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
)
const packageJson = JSON.parse(
  readFileSync(path.join(packageRoot, 'package.json'), 'utf8')
)
const tempRoot = mkdtempSync(path.join(tmpdir(), 'teo-tsconfig-consumer-'))
const tarballDir = path.join(tempRoot, 'tarballs')
const consumerDir = path.join(tempRoot, 'consumer')

process.on('exit', () => {
  rmSync(tempRoot, { force: true, recursive: true })
})

function writeJson(relativePath, value) {
  writeFileSync(
    path.join(consumerDir, relativePath),
    `${JSON.stringify(value, null, 2)}\n`
  )
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: options.cwd ?? consumerDir,
    stdio: options.stdio ?? 'inherit',
  })
}

mkdirSync(tarballDir)
mkdirSync(path.join(consumerDir, 'src'), { recursive: true })

run('pnpm', ['pack', '--pack-destination', tarballDir], {
  cwd: packageRoot,
})

const tarballName = readdirSync(tarballDir).find((file) =>
  file.endsWith('.tgz')
)

if (!tarballName) {
  throw new Error('pnpm pack did not create a tarball')
}

const tarballFiles = run('tar', ['-tzf', path.join(tarballDir, tarballName)], {
  cwd: packageRoot,
  stdio: 'pipe',
})
  .toString('utf8')
  .trim()
  .split('\n')
  .sort()
const expectedTarballFiles = [
  'package/LICENSE',
  'package/README.md',
  'package/package.json',
  'package/tsconfig.angular.json',
  'package/tsconfig.base.json',
  'package/tsconfig.expo.json',
  'package/tsconfig.nest.json',
  'package/tsconfig.next.json',
  'package/tsconfig.react-router.json',
  'package/tsconfig.vite-react.json',
].sort()

if (JSON.stringify(tarballFiles) !== JSON.stringify(expectedTarballFiles)) {
  throw new Error(
    `Unexpected packed files:\n${tarballFiles.map((file) => `- ${file}`).join('\n')}`
  )
}

writeJson('package.json', {
  private: true,
  type: 'module',
  dependencies: {
    [packageJson.name]: `file:${path.join(tarballDir, tarballName)}`,
    '@types/jest': '^30.0.0',
    '@types/node': '^24.0.0',
    typescript: '^5.8.3',
    vite: '^7.0.0',
  },
})

const presets = [
  'base',
  'next',
  'react-router',
  'nest',
  'vite-react',
  'expo',
  'angular',
]

for (const preset of presets) {
  writeJson(`tsconfig.${preset}.json`, {
    extends: `${packageJson.name}/${preset}`,
    compilerOptions: {
      incremental: false,
      noEmit: true,
    },
    include: [`src/${preset}.ts`],
  })
  writeFileSync(
    path.join(consumerDir, 'src', `${preset}.ts`),
    `export const preset = ${JSON.stringify(preset)}\n`
  )
}

run('pnpm', ['install', '--ignore-scripts'])

for (const preset of presets) {
  await import(`${packageJson.name}/${preset}`, { with: { type: 'json' } })
  run('pnpm', [
    'exec',
    'tsc',
    '--project',
    `tsconfig.${preset}.json`,
    '--pretty',
    'false',
  ])
}

console.log('tsconfig packed consumer matrix ok')
