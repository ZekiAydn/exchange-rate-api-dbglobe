import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { createPinia } from 'pinia';
import router from './router';
import './styles/global.css';


const app = createApp(App);


app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
});

app.use(createPinia());
app.use(router);
app.mount('#app');
