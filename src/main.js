import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { createPinia } from 'pinia';
import router from './router';
import './global.css';
import i18n from './i18n';
import {Column, DataTable, DatePicker, InputNumber, Select,Button, MultiSelect, ProgressSpinner,Toast} from "primevue";
import Chart from 'primevue/chart';
const app = createApp(App);


app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
});

app.component("ProgressSpinner", ProgressSpinner);
app.component("InputNumber", InputNumber);
app.component("MultiSelect", MultiSelect);
app.component("DatePicker", DatePicker);
app.component("DataTable", DataTable);
app.component("Select", Select);
app.component("Column", Column);
app.component("Button", Button);
app.component("Chart", Chart);
app.component("Toast", Toast);


app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount('#app');
