import { useEffect, useState } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage.tsx';
import { TeachersPage } from './pages/Teachers/TeachersPage.tsx';
import { Header } from './components/Header/Header.tsx';
import { Login } from "./components/Modals/LoginModal.tsx";
import { ProfilePage } from './pages/Profile/ProfilePage.tsx';
import { Register } from './components/Modals/Register.Modal.tsx';
import { Toaster } from 'react-hot-toast';

// 1. Импортируем хук стора
import { useAuthStore } from './store/authStore.ts';
// (Удалили импорты onAuthStateChanged и auth, так как они теперь внутри стора)

function App() {
  // 2. Достаем функцию initAuth вместо setUser
  const { initAuth } = useAuthStore();
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // 3. Вызываем initAuth при монтировании. Стор сам во всем разберется!
  useEffect(() => {
    initAuth();
  }, [initAuth]);

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
          style: {
            background: '#FCFCFC', 
            color: '#121417', 
            border: '1px solid #103931', 
            borderRadius: '12px', 
            padding: '16px 24px', 
            fontSize: '16px', 
            fontWeight: '500',
          },
          success: {
            style: {
              background: '#E0F3EC', 
              color: '#103931', 
              border: '1px solid #103931',
            },
            iconTheme: {
              primary: '#103931', 
              secondary: '#E0F3EC', 
            },
          },
          error: {
            style: {
              background: '#FDECEB', 
              color: '#D80027', 
              border: '1px solid #D80027',
            },
            iconTheme: {
              primary: '#D80027', 
              secondary: '#FDECEB', 
            },
          },
        }} 
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;