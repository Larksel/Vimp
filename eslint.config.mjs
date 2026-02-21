// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  importPlugin.flatConfigs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  {
    settings: {
      react: {
        version: '19.1.0',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  {
    ignores: ['venv/*', '.vite/*', '**/.*', '**/*.{js,cjs,jsx}'],
  },
  {
    files: ['**/*.{mjs,ts,tsx}'],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'off',
      'no-unresolved': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/no-unknown-property': 'off',
      'import/no-nodejs-modules': 'off',
      'import/no-dynamic-require': 'warn',
      'import/no-cycle': ['error', { ignoreExternal: true }],
      'import/named': 'off',
      'prefer-const': 'warn',
    },
  },
);
