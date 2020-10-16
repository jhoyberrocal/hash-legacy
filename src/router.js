import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home';
import Hasher from "./views/Hasher";
import Explorer from "./views/Collections";
import Document from "./views/Document";

Vue.use(VueRouter);

const routes = [
    {path: '/', component: Home},
    {
        path: '/hasher',
        component: Hasher,
        children: [
            {path: '', component: Explorer},
            {path: ':idF', component: Document}
        ]
    }
];

const router = new VueRouter({
    routes
});

export default router;

