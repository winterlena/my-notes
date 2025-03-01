<template>
  <div class="notes-container">
    <div v-for="note in notes" :key="note.id" class="note">
      <h2 class="note-title">{{ note.title }}</h2>
      <p class="note-content">{{ note.content }}</p>
      <button class="note-delete" @click="deleteNote(note.id)">
        <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m1.667 1 16 16m0-16-16 16" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Удалить
      </button>
    </div>

    <button class="note-add-button" @click="showAddNoteModal">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 9h16M9 1v16" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
  <AddNoteModal v-if="isAddNoteModalVisible" @close="closeAddNoteModal" @add-note="handleAddNote" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import AddNoteModal from '@/components/AddNoteModal.vue';

const authStore = useAuthStore();
const notes = computed(() => authStore.notes);
const isAddNoteModalVisible = ref(false);

onMounted(() => {
  console.log('Заметки в компоненте:', notes.value);
});

const showAddNoteModal = () => {
  isAddNoteModalVisible.value = true;
};

const closeAddNoteModal = () => {
  isAddNoteModalVisible.value = false;
};

const handleAddNote = async (title: string, content: string) => {
  try {
    await authStore.addNote(title, content);
    closeAddNoteModal();
  } catch (error) {
    console.error('Ошибка добавления заметки:', error);
  }
};

const deleteNote = async (id: number) => {
  try {
    await authStore.deleteNote(id);
  } catch (error) {
    console.error('Ошибка удаления заметки:', error);
  }
};
</script>

<style scoped>
.notes-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 40px;
  align-items: start;
}

.note {
  background-color: var(--green-light-color);
  border-radius: 8px;
  border: none;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 15px 15px -10px rgba(0, 0, 0, 0.4);
}

/* Загнутый уголок справа вверху */
.note::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  border-width: 40px 0 0 40px;
  background-color: var(--green-color);
  border-radius: 0 0 0 12px;
}

.note::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  border-style: solid;
  border-width: 0 40px 40px 0;
  border-color: transparent var(--dark-color) transparent transparent;
}

.note-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  margin: 20px 28px;
}

.note-content {
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  margin: 20px 28px;
  border-top: 1px solid var(--green-color);
  flex-grow: 1;
}

.note-delete {
  margin: 8px;
  align-self: end;
  display: inline-flex;
  align-items: center;
  gap: 17px;
}

.note-delete:hover, .note-delete:active, .note-delete:disabled {
  background-color: transparent;
  color: var(--green-middle-color);
}

.note-add-button {
  position: fixed;
  width: 56px;
  height: 56px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 40px;
  right: 40px;
  box-shadow: 0px 15px 46px -10px rgba(0, 0, 0, 0.6);
}

/* Адаптивные стили */
@media (max-width: 1367px) {
  .note-add-button {
    right: 12px;
  }

  .notes-container {
    gap: 20px;
  }
}

@media (max-width: 769px) {
  .note-add-button {
    right: 8px;
  }

  .notes-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 361px) {

}
</style>