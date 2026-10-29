module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es2022: true,
    node: true,
    browser: true,
  },
  plugins: ['@typescript-eslint'],
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    'prefer-const': 'warn',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '.vite/', 'coverage/', '**/dist/', '**/*.d.ts'],
  overrides: [
    {
      files: ['apps/web/**/*.ts', 'apps/web/**/*.tsx', 'packages/sdk/**/*.ts', 'packages/sdk/**/*.tsx'],
      env: {
        browser: true,
        node: true,
      },
    },
    {
      files: ['apps/server/**/*.ts', 'packages/db/**/*.ts'],
      env: {
        node: true,
        browser: false,
      },
    },
  ],
};
