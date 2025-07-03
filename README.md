# @teo-garcia/tsconfig-shared

TypeScript configurations for modern development workflows.

## Installation

```bash
npm install --save-dev @teo-garcia/tsconfig-shared
```

## Usage

Extend the appropriate configuration for your framework:

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

### Nest.js

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

## Available Configurations

- `base` - Common TypeScript settings
- `next` - Next.js optimized configuration
- `react-router` - React Router configuration
- `nest` - Nest.js server configuration
- `vite-react` - Vite + React configuration

## License

MIT
