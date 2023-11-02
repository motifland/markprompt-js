module.exports = {
  ignorePatterns: ['.next/', '.docusaurus/', 'build/', 'coverage/', 'dist/'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['examples/**/tsconfig.json', 'packages/**/tsconfig.json'],
      },
      node: true,
    },
    react: {
      version: 'detect',
    },
  },
  plugins: ['@typescript-eslint'],
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: false,
  },
  rules: {
    'no-console': 'error',
    'import/default': 'off',
    'import/namespace': 'off',
    'import/no-named-as-default-member': 'off',
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'object',
        ],
        pathGroups: [{ pattern: '@/**', group: 'internal' }],
        'newlines-between': 'always',
      },
    ],
    'import/no-unresolved': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/stylistic',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/consistent-indexed-object-style': [
          'error',
          'index-signature',
        ],
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          { allowExpressions: true },
        ],
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['*.test.ts', '*.test.tsx'],
      extends: [
        'plugin:jest-dom/recommended',
        'plugin:testing-library/react',
        'plugin:vitest/recommended',
      ],
    },
  ],
};
