<div align="center">

# @teo-garcia/tsconfig-shared

**Shared TypeScript configurations for modern development workflows**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@teo-garcia/tsconfig-shared?color=blue)](https://www.npmjs.com/package/@teo-garcia/tsconfig-shared)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)

Part of the [@teo-garcia/templates](https://github.com/teo-garcia/templates) ecosystem

</div>

---

## Features

| Config | Target | Use Case |
|--------|--------|----------|
| **base** | ESNext | Common TypeScript settings |
| **next** | ESNext | Next.js projects |
| **react-router** | ESNext | React Router + Vite |
| **nest** | ES2022 | NestJS server projects |
| **vite-react** | ESNext | Vite + React SPA |

## Requirements

- TypeScript 5+

## Quick Start

```bash
# Install the package
pnpm add -D @teo-garcia/tsconfig-shared
```

### Next.js

```json
{
  "extends": "@teo-garcia/tsconfig-shared/next",
  "compilerOptions": {
    "paths": { "@/*": ["./app/*"] }
  }
}
```

### React Router

```json
{
  "extends": "@teo-garcia/tsconfig-shared/react-router",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./app/*"] }
  }
}
```

### NestJS

```json
{
  "extends": "@teo-garcia/tsconfig-shared/nest",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Vite + React

```json
{
  "extends": "@teo-garcia/tsconfig-shared/vite-react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Exports

| Export | Description |
|--------|-------------|
| `@teo-garcia/tsconfig-shared/base` | Common TypeScript settings |
| `@teo-garcia/tsconfig-shared/next` | Next.js optimized |
| `@teo-garcia/tsconfig-shared/react-router` | React Router + Vite |
| `@teo-garcia/tsconfig-shared/nest` | NestJS server |
| `@teo-garcia/tsconfig-shared/vite-react` | Vite + React SPA |

## Related Packages

| Package | Description |
|---------|-------------|
| [@teo-garcia/eslint-config-shared](https://github.com/teo-garcia/eslint-config-shared) | ESLint rules |
| [@teo-garcia/prettier-config-shared](https://github.com/teo-garcia/prettier-config-shared) | Prettier formatting |
| [@teo-garcia/vitest-config-shared](https://github.com/teo-garcia/vitest-config-shared) | Test configuration |

## License

MIT

---

<div align="center">
  <sub>Built by <a href="https://github.com/teo-garcia">teo-garcia</a></sub>
</div>
