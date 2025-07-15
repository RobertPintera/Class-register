import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import router from './router';
import { Button, ButtonGroup, Column, DataTable, Dialog, InputNumber, InputText, Menubar, Ripple } from 'primevue';
import 'primeicons/primeicons.css';
import { createPinia } from 'pinia';

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.directive('ripple', Ripple);
app.component('Menubar', Menubar);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ButtonGroup',ButtonGroup);
app.component('Dialog', Dialog);
app.component('InputText',InputText);
app.component("InputNumber",InputNumber);

const pinia = createPinia();
app.use(pinia);
app.use(router);

app.mount('#app');
