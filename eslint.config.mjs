import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

const eslintConfig = [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'node_modules/',
      'dist/',
    ],
  },
  {
    ...stylistic.configs['recommended-flat'],
    ...stylistic.configs.customize({
      // override stylistic rules here
    }),
  },
]

export default eslintConfig
