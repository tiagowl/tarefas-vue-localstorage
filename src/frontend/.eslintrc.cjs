module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['dist', 'node_modules', 'coverage', 'playwright-report', 'test-results'],
  rules: {
    'vue/multi-word-component-names': ['error', { ignores: ['App', 'Pagination'] }],
    'vue/require-default-prop': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'vue/no-v-html': 'error',
  },
  overrides: [
    {
      files: ['src/domain/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  'vue',
                  'pinia',
                  '@/stores/*',
                  '@/data/*',
                  '@/components/*',
                  '@/composables/*',
                ],
                message: 'A camada domain/ deve ser TypeScript puro (sem vue, pinia, stores, data, components).',
              },
            ],
          },
        ],
      },
    },
  ],
};
