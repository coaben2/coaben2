import './assets/style.css';
import './assets/progressBar.css';
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';

import App from './App.vue';
import router from './router';
import { useUserStore } from '@/stores/user';

function globalErrorHandler(err, instance, info) {
    if (process.env.NODE_ENV === 'test') {
        console.error(`Erreur capturée : ${err}`);
        console.error(`Instance :`, instance);
        console.error(`Info :`, info);
    }
    // Optionally, you can log errors to an external service here
}

const app = createApp(App);

app.config.errorHandler = globalErrorHandler;

app.config.warnHandler = function (msg, instance, trace) {
    if (process.env.NODE_ENV === 'test') {
        console.error(`Avertissement : ${msg}`);
        console.error(`Instance :`, instance);
        console.error(`Trace :`, trace);
    }
    // Optionally, you can log warnings to an external service here
};

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);

const userStore = useUserStore();
userStore.initApiKey();

app.mount('#app');
