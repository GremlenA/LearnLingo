import { useEffect, useState } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage.tsx';
import { TeachersPage } from './pages/Teachers/TeachersPage.tsx';
import { FavoritesPage } from './pages/Favorite/FavoritesPage.tsx';
import { Header } from './components/Header/Header.tsx';
import { Login } from "./components/Modals/LoginModal.tsx";
import { Register } from './components/Modals/Register.Modal.tsx';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore.ts';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase/getFirestore.ts';

function App() {

  const setUser = useAuthStore((state) => state.setUser);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

      useEffect(() => {
    // onAuthStateChanged возвращает функцию "отписки". 
    // Мы сохраняем её, чтобы React мог правильно "убрать за собой", если компонент демонтируется.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Если пользователь есть, кладем его в Zustand
        setUser(currentUser);
      } else {
        // Если пользователя нет (вышел или не входил), кладем null
        setUser(null);
      }
    });

    // Очистка слушателя при размонтировании (хорошая практика в React)
    return () => unsubscribe();
  }, [setUser]); // useEffect выполнится только один раз при монтировании App

  return (
    <>
      <Header 
        openLogin={() => setIsLoginOpen(true)}
        register={() => setIsRegisterOpen(true)}
      />
      
      {isRegisterOpen && (
        <Register closeModal={() => setIsRegisterOpen(false)} />
      )}
      {isLoginOpen && (
        <Login closeModal={() => setIsLoginOpen(false)} />
      )}
       <Toaster 
  position="top-right"
  toastOptions={{
    // 1. Общие стили для ВСЕХ уведомлений
    style: {
      background: '#FCFCFC', // Цвет фона (можешь поставить цвет своих модалок)
      color: '#121417', // Цвет текста
      border: '1px solid #103931', // Обводка, если нужна
      borderRadius: '12px', // Скругление углов
      padding: '16px 24px', // Внутренние отступы
      fontSize: '16px', // Размер шрифта
      fontWeight: '500',
    },
    
    // 2. Специфичные стили для успешных действий (зеленые)
    success: {
      style: {
        background: '#E0F3EC', // Нежно-зеленый фон
        color: '#103931', // Темно-зеленый текст
        border: '1px solid #103931',
      },
      iconTheme: {
        primary: '#103931', // Цвет самой галочки
        secondary: '#E0F3EC', // Цвет фона вокруг галочки
      },
    },

    // 3. Специфичные стили для ошибок (красные)
    error: {
      style: {
        background: '#FDECEB', // Нежно-красный фон
        color: '#D80027', // Темно-красный текст
        border: '1px solid #D80027',
      },
      iconTheme: {
        primary: '#D80027', // Цвет крестика
        secondary: '#FDECEB', 
      },
    },
  }} 
/>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;