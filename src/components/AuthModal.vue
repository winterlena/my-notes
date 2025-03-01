<template>
  <div class="modal-overlay" @click="closeModal">
    <form @submit.prevent="handleSubmit">
      <div class="modal-content" @click.stop>

        <button class="close-button" @click="closeModal">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L17 17M17 1L1 17" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <h2>{{ isLoginMode ? 'Вход в ваш аккаунт' : 'Регистрация' }}</h2>

        <div class="modal-input">
          <div class="modal-input-group">
            <label for="email">Email</label>
            <input v-model="email" type="email" placeholder="Введите значение" required />
          </div>

          <div class="modal-input-group">
            <label for="password">Пароль</label>
            <div class="password-input">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Введите пароль"
                required
              />
            <span class="toggle-password" @click="togglePasswordVisibility">
              <svg v-if="showPassword" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7c0 1.155-.78 2.65-2.277 3.9C13.253 12.129 11.226 13 9 13s-4.254-.872-5.723-2.1C1.78 9.65 1 8.156 1 7s.78-2.65 2.277-3.9C4.747 1.871 6.774 1 9 1s4.254.872 5.723 2.1C16.22 4.35 17 5.844 17 7Z" stroke="#B1C909" stroke-width="2"/>
                <circle cx="9" cy="7" r="3" stroke="#B1C909" stroke-width="2"/>
              </svg>
              <svg v-else width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8c0 1.155-.78 2.65-2.277 3.9C13.253 13.129 11.226 14 9 14s-4.254-.872-5.723-2.1C1.78 10.65 1 9.156 1 8s.78-2.65 2.277-3.9C4.747 2.871 6.774 2 9 2s4.254.872 5.723 2.1C16.22 5.35 17 6.844 17 8Z" stroke="#B1C909" stroke-width="2"/>
                <circle cx="9" cy="8" r="3" stroke="#B1C909" stroke-width="2"/>
                <path d="m2 1 14 14" stroke="#B1C909" stroke-width="2"/>
              </svg>
            </span>
            </div> 
          </div>

          <div class="modal-input-group"  v-if="!isLoginMode">
            <label for="password">Пароль ещё раз</label>
            <div class="password-input">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                placeholder="Введите пароль ещё раз"
                required
              />
            <span class="toggle-password" @click="toggleConfirmPasswordVisibility">
              <svg v-if="showConfirmPassword" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7c0 1.155-.78 2.65-2.277 3.9C13.253 12.129 11.226 13 9 13s-4.254-.872-5.723-2.1C1.78 9.65 1 8.156 1 7s.78-2.65 2.277-3.9C4.747 1.871 6.774 1 9 1s4.254.872 5.723 2.1C16.22 4.35 17 5.844 17 7Z" stroke="#B1C909" stroke-width="2"/>
                <circle cx="9" cy="7" r="3" stroke="#B1C909" stroke-width="2"/>
              </svg>
              <svg v-else width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8c0 1.155-.78 2.65-2.277 3.9C13.253 13.129 11.226 14 9 14s-4.254-.872-5.723-2.1C1.78 10.65 1 9.156 1 8s.78-2.65 2.277-3.9C4.747 2.871 6.774 2 9 2s4.254.872 5.723 2.1C16.22 5.35 17 6.844 17 8Z" stroke="#B1C909" stroke-width="2"/>
                <circle cx="9" cy="8" r="3" stroke="#B1C909" stroke-width="2"/>
                <path d="m2 1 14 14" stroke="#B1C909" stroke-width="2"/>
              </svg>
            </span>
            </div> 
          </div>
        </div>

        <div class="toggle-mode">
          <p> У вас нет аккаунта? <span @click="toggleMode">{{ isLoginMode ? 'Зарегистрируйтесь' : 'Войдите' }}</span> </p>
          <button type="submit">Войти</button>
        </div>

        <div class="error-container">
          <p v-if="error" class="error">{{ error }}</p>
        </div>

      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const error = ref('');
const isLoginMode = ref(true);

const emit = defineEmits(['close']);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const handleSubmit = async () => {
  try {
    if (!isLoginMode.value && password.value !== confirmPassword.value) {
      error.value = 'Пароли не совпадают';
      return;
    }

    if (isLoginMode.value) {
      await authStore.login(email.value, password.value);
    } else {
      await authStore.register(email.value, password.value, confirmPassword.value);
    }

    emit('close');
  } catch (err) {
    error.value = isLoginMode.value ? 'Ошибка авторизации. Проверьте данные.' : 'Ошибка регистрации. Проверьте данные.';
  }
};

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  error.value = '';
  confirmPassword.value = '';
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

.modal-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

label, p {
  padding-left: 28px;
}

p {
  padding: 0;
  margin: 0;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-mode span {
  color: var(--green-light-color);
  font-weight: 700;
  cursor: pointer;
  transition: color 0.3s ease;
}

.toggle-mode span:hover {
  color: var(--text-white-color);
}

.error-container {
  position: absolute;
  bottom: 5%;
  left: 10%;
  right: 0;
}

.error {
  color:var(--error-color);
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;
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
    margin: 90px 16px;
    gap: 16px;
  }

  .close-button {
    top: 12px;
    right: 12px;
  }

  .toggle-mode {
    flex-direction: column-reverse;
    gap: 12px;
  }

  p, .toggle-mode span, .error {
    font-size: 14px;
    line-height: 24px;
  }

  .button-login {
    width: 100%;
  }

  .error-container {
    left: 0;
    text-align: center;
  }
}
</style>