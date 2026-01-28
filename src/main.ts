/*
MIT License

Copyright (c) 2025 Robert Pintera

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import router from './router';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel, Button, ButtonGroup, Checkbox, Column, ConfirmationService, ConfirmDialog, DataTable, Dialog, FloatLabel, IconField, ImageCompare, InputIcon, InputNumber, InputText, Knob, Listbox, Menu, Menubar, Message, MeterGroup, Paginator, ProgressSpinner, RadioButton, RadioButtonGroup, Ripple, Select, SelectButton, Tag, Toast, ToastService, ToggleSwitch, Toolbar, Tooltip } from 'primevue';
import 'primeicons/primeicons.css';
import { createPinia } from 'pinia';
import { definePreset } from '@primeuix/themes';
import { Form } from '@primevue/forms';
import Chart from 'primevue/chart';

const app = createApp(App);

const CustomPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}'
    },
    colorScheme: {
      dark: {
        surface: {
          0: '#ffffff',
          800: 'var(--color-second-border)',
          900: 'var(--color-card)',
          950: 'var(--color-card)'
        }
      }
    }
  }
});

app.use(PrimeVue, {
  theme: {
    preset: CustomPreset,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'base, primevue, theme'
      },
      darkModeSelector: '.dark',
    }
  }
});

app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);
app.use(ConfirmationService);
app.use(ToastService);
app.component('Button', Button);
app.component('ButtonGroup',ButtonGroup);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('Dialog', Dialog);
app.component('InputText',InputText);
app.component("InputNumber", InputNumber);
app.component("InputIcon", InputIcon);
app.component("IconField", IconField);
app.component("FloatLabel", FloatLabel);
app.component('Menubar', Menubar);
app.component("Message", Message);
app.component("Form", Form);
app.component("Toolbar", Toolbar);
app.component("DataView", DataView);
app.component("Accordion", Accordion);
app.component("AccordionPanel", AccordionPanel);
app.component("AccordionHeader", AccordionHeader);
app.component("AccordionContent", AccordionContent);
app.component("Knob", Knob);
app.component("Chart", Chart);
app.component("Select", Select);
app.component("ToggleSwitch",ToggleSwitch);
app.component("ProgressSpinner", ProgressSpinner);
app.component("Listbox", Listbox);
app.component("MeterGroup",MeterGroup);
app.component("SelectButton",SelectButton);
app.component("Checkbox",Checkbox);
app.component("Paginator",Paginator);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast',Toast);
app.component("Tag",Tag);
app.component('RadioButton',RadioButton);
app.component('RadioButtonGroup',RadioButtonGroup);
app.component('ImageCompare',ImageCompare);

const pinia = createPinia();
app.use(pinia);
app.use(router);

app.mount('#app');
