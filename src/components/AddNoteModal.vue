<template>
  <div class="modal-overlay" @click="closeModal">
    <form @submit.prevent="handleSubmit">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L17 17M17 1L1 17" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <h2>Добавление заметки</h2>

        <div class="modal-input">
          <div class="modal-input-group">
            <label for="note-title">Название заметки</label>
            <input
              id="note-title"
              type="text"
              v-model="title"
              placeholder="Введите название"
              maxlength="100"
              required
            />
            <span class="char-counter">{{ title.length }}/100</span>
          </div>

          <div class="modal-textarea-group">
            <label for="note-content">Текст заметки</label>
            <textarea
              id="note-content"
              v-model="content"
              placeholder="Введите текст"
              maxlength="500"
              required
            ></textarea>
            <span class="char-counter">{{ content.length }}/500</span>
          </div>
        </div>

        <button type="submit"  class="button-add-note">Добавить</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const title = ref('');
const content = ref('');

const emit = defineEmits(['close', 'add-note']);

const handleSubmit = () => {
  emit('add-note', title.value, content.value);
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  display: flex;
  flex-direction: column;
  margin: 80px;
  gap: 40px;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-input {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-input-group, .modal-textarea-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  padding-left: 28px;
}

.char-counter {
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;
  color: var(--gray-color);
  text-align: end;
  padding-right: 24px;
}

.button-add-note {
  margin-left: auto;
}
 
/* Адаптивные стили */
@media (max-width: 1367px) {
  .modal-content {
    margin: 56px;
  }
}

@media (max-width: 769px) {

}

@media (max-width: 361px) {
  .modal-content {
    margin: 24px 16px;
    gap: 28px;
  }

  .close-button {
    top: 12px;
    right: 12px;
  }

  .modal-input {
    gap: 16px;
  }

  .button-add-note {
    margin-left: 0;
  }
}
 </style>