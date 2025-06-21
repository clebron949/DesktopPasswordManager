import { createMemoryHistory, createRouter } from "vue-router";
import { createApp } from "vue";
import { createPinia } from 'pinia'
import "./style.css";
import App from "./App.vue";
import HomeView from "./views/HomeView.vue";
import AboutView from "./views/AboutView.vue";
import AddPasswordView from "./views/AddPasswordView.vue";
import PasswordGeneratorView from "./views/PasswordGeneratorView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/about", component: AboutView },
  { path: "/add-password/:id", component: AddPasswordView },
  { path: "/password-generator", component: PasswordGeneratorView },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const pinia = createPinia()

const app = createApp(App);
app.use(router);
app.use(pinia)
app.mount("#app");
