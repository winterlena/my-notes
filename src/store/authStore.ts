import { defineStore } from 'pinia';

interface Note {
  id: number;
  title: string;
  content: string;
}

interface AuthState {
  isAuthenticated: boolean;
  notes: Note[];
  token: string | null;
  userEmail: string | null;
  userId: number | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    notes: [],
    token: null,
    userEmail: null,
    userId: null,
  }),
  actions: {
    initializeAuth() {
      const token = localStorage.getItem('authToken');
      const userEmail = localStorage.getItem('userEmail');

      if (token && userEmail) {
        this.token = token;
        this.isAuthenticated = true;
        this.userEmail = userEmail;

        // Загружаем заметки
        this.fetchNotes();
      }
    },

    // Регистрация нового пользователя
    async register(email: string, password: string, confirmPassword: string) {
      try {
        if (password.length < 4) {
          throw new Error('Пароль не может быть короче 4 символов');
        }

        const payload = { email, password, confirm_password: confirmPassword };
        console.log('Отправляемые данные:', payload);

        const response = await fetch('https://dist.nd.ru/api/reg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Ошибка регистрации:', errorData);
          throw new Error(errorData.message || 'Ошибка регистрации');
        }

        const data = await response.json();
        console.log('Ответ сервера после регистрации:', data);

        // Автоматически авторизуем пользователя после регистрации
        await this.login(email, password);

        this.isAuthenticated = true;
        this.userEmail = email;

        // Получаем информацию о пользователе
        await this.fetchUserInfo();

        
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        throw error;
      }
    },

    // Авторизация пользователя
    async login(email: string, password: string) {
      try {
        if (password.length < 4) {
          throw new Error('Пароль не может быть короче 4 символов');
        }

        const payload = { email, password };
        console.log('Отправляемые данные:', payload);

        const response = await fetch('https://dist.nd.ru/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Ошибка авторизации:', errorData);
          throw new Error(errorData.message || 'Ошибка авторизации');
        }

        const data = await response.json();
        console.log('Ответ сервера после авторизации:', data);

        // Сохраняем токен и email
        if (!data.accessToken) {
          throw new Error('Токен не получен от сервера');
        }

        this.token = data.accessToken;
        this.isAuthenticated = true;
        this.userEmail = email;

        // Сохраняем токен в localStorage
        localStorage.setItem('authToken', data.accessToken);
        localStorage.setItem('userEmail', email);

        // Загружаем заметки после успешной авторизации
        await this.fetchNotes();
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        throw error;
      }
    },

    // Получение информации о пользователе
    async fetchUserInfo() {
      try {
        if (!this.token) {
          throw new Error('Токен отсутствует');
        }
    
        console.log('Токен для запроса информации о пользователе:', this.token);
    
        const response = await fetch('https://dist.nd.ru/api/auth', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Ошибка загрузки информации о пользователе:', errorData);
          throw new Error(errorData.message || 'Ошибка загрузки информации о пользователе');
        }
    
        const data = await response.json();
        console.log('Ответ сервера после запроса информации о пользователе:', data);
    
        // Проверяем, есть ли id и email в ответе
        if (!data.id || !data.email) {
          throw new Error('Информация о пользователе не получена');
        }
    
        // Сохраняем id и email пользователя
        this.userId = data.id;
        this.userEmail = data.email;
      } catch (error) {
        console.error('Ошибка загрузки информации о пользователе:', error);
        throw error;
      }
    },

    // Выход из системы (отзыв токена)
    async logout() {
      try {
        console.log('Токен до выхода:', this.token);
        console.log('Состояние до выхода:', this.$state);
    
        const response = await fetch('https://dist.nd.ru/api/auth', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Ошибка выхода из системы:', errorData);
          throw new Error(errorData.message || 'Ошибка выхода из системы');
        }
    
        // Сбрасываем состояние
        this.isAuthenticated = false;
        this.token = null;
        this.userEmail = null;
        this.userId = null;
        this.notes = [];
    
        console.log('Токен после выхода:', this.token);
        console.log('Состояние после выхода:', this.$state);

        // Удаляем токен из localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
      } catch (error) {
        console.error('Ошибка выхода из системы:', error);
        throw error;
      }
    },

    // Получение заметок
    async fetchNotes() {
      try {
        console.log('Загрузка заметок...');
        const response = await fetch('https://dist.nd.ru/api/notes', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Ошибка загрузки заметок:', errorData);
          throw new Error(errorData.message || 'Ошибка загрузки заметок');
        }
    
        const data = await response.json();
        console.log('Ответ сервера после загрузки заметок:', data);

        // Проверяем, что data является массивом
        if (!Array.isArray(data)) {
          throw new Error('Ожидался массив заметок');
        }

        this.notes = data;
      } catch (error) {
        console.error('Ошибка загрузки заметок:', error);
        throw error;
      }
    },

    // Добавление заметки
    async addNote(title: string, content: string) {
      try {
        const payload = { title, content };
        console.log('Отправляемые данные:', payload);
    
        const response = await fetch('https://dist.nd.ru/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Ошибка добавления заметки:', errorData);
          throw new Error(errorData.message || 'Ошибка добавления заметки');
        }
    
        const data = await response.json();
        console.log('Ответ сервера после добавления заметки:', data);

        // Логируем состояние notes перед добавлением
        console.log('Состояние notes перед добавлением:', this.notes);
    
        // Добавляем новую заметку в список
        this.notes.push({
          id: data.id,
          title: data.title,
          content: data.content,
        });

        // Логируем состояние notes после добавления
        console.log('Состояние notes после добавления:', this.notes);
      } catch (error) {
        console.error('Ошибка добавления заметки:', error);
        throw error;
      }
    },

    // Удаление заметки
    async deleteNote(id: number) {
      try {
        const response = await fetch(`https://dist.nd.ru/api/notes/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Ошибка удаления заметки:', errorData);
          throw new Error(errorData.message || 'Ошибка удаления заметки');
        }
    
        // Удаляем заметку из списка
        this.notes = this.notes.filter((note) => note.id !== id);
      } catch (error) {
        console.error('Ошибка удаления заметки:', error);
        throw error;
      }
    },
  },
});