import { execFileSync } from 'node:child_process'
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
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

mkdirSync(tarballDir)
mkdirSync(path.join(consumerDir, 'src'), { recursive: true })

execFileSync('pnpm', ['pack', '--pack-destination', tarballDir], {
  cwd: packageRoot,
  stdio: 'inherit',
})

const tarballName = readdirSync(tarballDir).find((file) =>
  file.endsWith('.tgz')
)

if (!tarballName) {
  throw new Error('pnpm pack did not create a tarball')
}

writeFileSync(
  path.join(consumerDir, 'package.json'),
  `${JSON.stringify(
    {
      private: true,
      type: 'module',
      dependencies: {
        [packageJson.name]: `file:${path.join(tarballDir, tarballName)}`,
        typescript: '^5.8.3',
        vite: '^7.0.0',
      },
    },
    null,
    2
  )}\n`
)

writeFileSync(
  path.join(consumerDir, 'tsconfig.json'),
  `${JSON.stringify(
    {
      extends: '@teo-garcia/tsconfig-shared/vite-react',
      compilerOptions: {
        incremental: false,
      },
      include: ['src/**/*.ts'],
    },
    null,
    2
  )}\n`
)

writeFileSync(
  path.join(consumerDir, 'src/index.ts'),
  'export const mode: string = import.meta.env.MODE\n'
)

execFileSync('pnpm', ['install', '--ignore-scripts'], {
  cwd: consumerDir,
  stdio: 'inherit',
})

for (const specifier of [
  '@teo-garcia/tsconfig-shared/base',
  '@teo-garcia/tsconfig-shared/next',
  '@teo-garcia/tsconfig-shared/react-router',
  '@teo-garcia/tsconfig-shared/nest',
  '@teo-garcia/tsconfig-shared/vite-react',
  '@teo-garcia/tsconfig-shared/expo',
]) {
  await import(specifier, { with: { type: 'json' } })
}

execFileSync('pnpm', ['exec', 'tsc', '--noEmit', '--incremental', 'false'], {
  cwd: consumerDir,
  stdio: 'inherit',
})

console.log('tsconfig packed consumer smoke ok')
