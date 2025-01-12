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
    console.debug(`Erreur capturée : ${err}`);
    console.debug(`Instance :`, instance);
    console.debug(`Info :`, info);

    /*alert('Une erreur est survenue. Veuillez réessayer plus tard.');*/
}

const app = createApp(App);

app.config.errorHandler = globalErrorHandler;

app.config.warnHandler = function (msg, instance, trace) {
    console.warn(`Avertissement : ${msg}`);
    console.warn(`Instance :`, instance);
    console.warn(`Trace :`, trace);
};

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);

const userStore = useUserStore();
userStore.initApiKey();

app.mount('#app');
