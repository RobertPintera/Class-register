import pluginVue from 'eslint-plugin-vue';
import {
  defineConfigWithVueTs,
  vueTsConfigs,
  configureVueProject,
} from '@vue/eslint-config-typescript';

configureVueProject({
  tsSyntaxInTemplates: true,
  scriptLangs: [
    'ts',
  ],

  allowComponentTypeUnsafety: true,
  rootDir: import.meta.dirname,
});


export default defineConfigWithVueTs(
  pluginVue.configs['flat/essential'],
  vueTsConfigs.base, 
  {
    files: ['**/*.{ts,vue}'],
    rules: {
      'semi': ['warn', 'always'],
      indent: ['warn', 2, { SwitchCase: 1 }],
      "vue/no-reserved-component-names": 'off',
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': ['warn', {
        html: {
          normal: 'always',
          component: 'always',
        },
      }],
    },
  },
);

