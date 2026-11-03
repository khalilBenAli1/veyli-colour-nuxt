import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
export default ts.config(
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      'node_modules/**',
      '.omx/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: ts.parser } },
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        defineNuxtConfig: 'readonly',
      },
    },
  },
  prettier,
);
