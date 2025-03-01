<template>
  <div>
    <NoteList v-if="isAuthenticated" />
    <div v-else class="welcome-content">
      <div class="content-text">
        <h1>Мои заметки</h1>
        <h3>Не забывай о важном, храни его в облаке.</h3>
      </div>
      <div class="content-image">
        <img src="@/assets/groupImg.png" alt="Logo" class="responsive-image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';
import NoteList from '@/components/NoteList.vue';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<style scoped>
.welcome-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.content-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;
}

.content-image {
  flex: 1;
}

.responsive-image {
  max-width: 100%;
  height: auto;
  transition: width 0.3s ease;
  display: block;
  margin: 0 auto;
}

h3 {
  margin-bottom: 48px;
}

/* Адаптивные стили */
@media (max-width: 1367px) {
  .content-img {
    max-width: 627px;
  }
}

@media (max-width: 769px) {
  .welcome-content {
    flex-direction: column;
    padding-top: 40px;
  }

  .content-text, .content-image {
    flex: none;
    gap: 20px;
  }

  .responsive-image {
    padding: 0 63px;
  }

  h1 {
    text-align: center;
  }

  h3 {
    text-align: center;
    margin-bottom: 0;
  }
}

@media (max-width: 361px) {
  .welcome-content {
    padding-top: 20px;
    gap: 17px;
  }

  .responsive-image {
    padding: 0 12px;
  }

  h1 {
    text-align: center;
  }

  h3 {
    text-align: center;
  }
}
</style>