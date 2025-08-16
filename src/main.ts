import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import router from './router';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel, Button, ButtonGroup, Checkbox, Column, ConfirmationService, ConfirmDialog, DataTable, Dialog, FloatLabel, IconField, InputIcon, InputNumber, InputText, Knob, Listbox, Menu, Menubar, Message, MeterGroup, Paginator, ProgressSpinner, Ripple, Select, SelectButton, Tag, Toast, ToastService, ToggleSwitch, Toolbar } from 'primevue';
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
    }
  }
});

app.use(PrimeVue, {
  theme: {
    preset: CustomPreset,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue'
      }
    }
  }
});

app.directive('ripple', Ripple);
app.use(ConfirmationService);
app.use(ToastService);
app.component('Menubar', Menubar);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ButtonGroup',ButtonGroup);
app.component('Dialog', Dialog);
app.component('InputText',InputText);
app.component("InputNumber", InputNumber);
app.component("InputIcon", InputIcon);
app.component("IconField", IconField);
app.component("FloatLabel", FloatLabel);
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
app.component('ConfirmDialog', ConfirmDialog)
app.component('Toast',Toast);
app.component("Tag",Tag);

const pinia = createPinia();
app.use(pinia);
app.use(router);

app.mount('#app');
