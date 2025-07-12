import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint';

export default [
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    rules: {
        'semi': ['warn', 'always'],
        'vue/html-closing-bracket-spacing': 'off',
        'vue/no-unused-vars': 'error',
        'vue/multi-word-component-names': 'off',
        'vue/first-attribute-linebreak': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/html-self-closing': ['warn', {
            html: {
                normal: 'always',
                component: 'always'
            }
        }]
    },
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    }
  }
]