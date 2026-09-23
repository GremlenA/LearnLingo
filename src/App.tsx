import { useState } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage.tsx';
import { TeachersPage } from './pages/Teachers/TeachersPage.tsx';
import { FavoritesPage } from './pages/Favorite/FavoritesPage.tsx';
import { Header } from './components/Header/Header.tsx';
import { Login } from "./components/Modals/LoginModal.tsx";
import { Register } from './components/Modals/Register.Modal.tsx';
import { Toaster } from 'react-hot-toast';

function App() {

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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
       <Toaster position="top-right" />

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