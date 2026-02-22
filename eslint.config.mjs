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
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // Services
            {
              target: './app/renderer/services/**/*',
              from: [
                './app/renderer/components/**/*',
                './app/renderer/core/**/*',
                './app/renderer/features/**/*',
                './app/renderer/hooks/**/*',
                './app/renderer/routes/**/*',
                './app/renderer/stores/**/*',
                './app/renderer/views/**/*',
              ],
              message:
                'Services (Electron) formam a base do sistema e não devem depender de lógicas superiores.',
            },

            // Core/Singletons
            {
              target: './app/renderer/core/**/*',
              from: [
                './app/renderer/components/**/*',
                './app/renderer/features/**/*',
                './app/renderer/hooks/**/*',
                './app/renderer/routes/**/*',
                './app/renderer/stores/**/*',
                './app/renderer/views/**/*',
              ],
              message:
                'Singletons e Workers devem ser agnósticos de interface e estado do React.',
            },

            // Stores
            {
              target: './app/renderer/stores/**/*',
              from: [
                './app/renderer/components/**/*',
                './app/renderer/features/**/*',
                './app/renderer/hooks/**/*',
                './app/renderer/routes/**/*',
                './app/renderer/views/**/*',
              ],
              message:
                'A Store não deve importar componentes visuais ou páginas.',
            },

            // Hooks
            {
              target: './app/renderer/hooks/**/*',
              from: [
                './app/renderer/components/**/*',
                './app/renderer/features/**/*',
                './app/renderer/routes/**/*',
                './app/renderer/views/**/*',
              ],
              message:
                'Hooks devem conter apenas lógica abstrata, sem acoplamento com Componentes React.',
            },

            // Componentes Comuns
            {
              target: './app/renderer/components/**/*',
              from: [
                './app/renderer/features/**/*',
                './app/renderer/views/**/*',
                './app/renderer/routes/**/*',
                './app/renderer/stores/**/*',
                './app/renderer/core/**/*',
              ],
              message:
                'Componentes comuns não devem acessar Features específicas, Páginas ou regras de negócio profundas.',
            },

            // Features
            {
              target: './app/renderer/features/**/*',
              from: ['./app/renderer/views/**/*', './app/renderer/routes/**/*'],
              message:
                'Features não devem importar Páginas ou configurações de Rotas. Prefira utilizar hooks globais',
            },

            // Páginas
            {
              target: './app/renderer/views/**/*',
              from: ['./app/renderer/routes/**/*'],
              message:
                'Páginas não devem importar a configuração de roteamento.',
            },
          ],
        },
      ],
    },
  },
);
