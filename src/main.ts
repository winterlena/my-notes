import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from '@/store/authStore';
import '@/assets/styles/global.css';

import '@fontsource/montserrat'; // Импорт стандартного начертания
import '@fontsource/montserrat/900.css'; // Импорт жирного начертания
import '@fontsource/montserrat/600.css'; // Импорт начертания с весом 600
import '@fontsource/montserrat/500.css'; // Импорт начертания с весом 500
import '@fontsource/montserrat/400.css'; // Импорт начертания с весом 400

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);

// Восстанавливаем состояние авторизации
const authStore = useAuthStore();
authStore.initializeAuth();

app.mount('#app');
