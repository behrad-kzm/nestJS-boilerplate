module.exports = {
  env: {
    commonjs: true,
    es2021: true,
  },
  extends: [
    'prettier',
    'plugin:security/recommended',
    'airbnb-base',
    'plugin:jest/all',
  ],
  plugins: ['prettier', 'security', 'jest', '@typescript-eslint'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    NodeJS: true,
    Express: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  ignorePatterns: [],
  rules: {
    'prettier/prettier': 'error',
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'arrow-parens': 'off',
    'jest/no-hooks': [
      'error',
      {
        allow: ['beforeAll', 'afterAll', 'beforeEach'],
      },
    ],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'operator-linebreak': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'newline-per-chained-call': 'off',
    'jest/require-hook': 'off',
    'brace-style': 'off',
    indent: 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
