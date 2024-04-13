import './assets/main.css'

import { createApp } from "vue";
import { createStore } from "vuex"

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from "./App.vue";
import router from "./router";
import Userstore from "./stores/User.js";
import Libstore from "./stores/Lib.js";

const store=createStore({
    modules: {
        user: Userstore,
        lib: Libstore
    }
})
const app = createApp(App);

app.use(router);
app.use(store);


app.mount("#app");