import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import axios from 'axios';

axios.defaults.baseURL = 'https://raw.githubusercontent.com/andreascandle/p2p_json_test/main/api/json/loans.json';

// Inject Axios into app instance
const app = createApp(App);
app.config.globalProperties.$axios = axios;

// Use router
app.use(router);

// Mount the app
app.mount('#app');

