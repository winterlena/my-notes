import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotesView from '@/views/NotesView.vue';
import { useAuthStore } from '@/store/authStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/notes',
      component: NotesView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.isAuthenticated) {
          next();
        } else {
          next('/');
        }
      },
    },
  ],
});

export default router;