import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylisticJs from '@stylistic/eslint-plugin-js';


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['src/**/*.{js,ts}'], ignores: ['dist/**/*'] },
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': ['error', 2 ],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'always'],
    }
  },
  {languageOptions: { globals: globals.browser }},
  ...tseslint.configs.recommended,
];