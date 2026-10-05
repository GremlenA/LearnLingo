import { create } from 'zustand';

// Описываем, какие данные будут в нашем хранилище
interface AuthState {
  user: any | null; // Здесь будет храниться объект юзера из Firebase (или null, если не вошел)
  isAuthLoaded: boolean; // Флаг, который скажет нам, что Firebase закончил первую проверку
  setUser: (user: any | null) => void; // Функция для изменения юзера
}

// Создаем само хранилище
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthLoaded: false, // Изначально проверка еще идет
  setUser: (user) => set({ user: user, isAuthLoaded: true }),
}));