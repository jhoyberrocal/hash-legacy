import './scss/main.scss';
import Vue from 'vue';
import io from 'socket.io-client';
import Vuetify from 'vuetify';
import "vuetify/dist/vuetify.min.css";
import router from './router';
import App from './App';

Vue.prototype.IO = io(process.env.SERVER_URL);
Vue.prototype.URL = process.env.SERVER_URL;

Vue.use(Vuetify);

new Vue({
    router,
    vuetify: new Vuetify({
        theme: {
            dark: false,
            options: {
                customProperties: true,
            },
        }
    }),
    render: h => h(App)
}).$mount('#app');
