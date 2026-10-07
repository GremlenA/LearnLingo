import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import css from "./Header.module.css";
import LoginIcon from "../../assets/images/log-in-01.svg";
import ukraineImg from "../../assets/images/ukraine.svg";
import { useAuthStore } from '../../store/authStore';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/getFirestore'; // Убедись, что путь правильный!
import toast from 'react-hot-toast'; // Для красивого уведомления о выходе

interface HeaderProps {
  openLogin: () => void;
  register: () => void;
}

export const Header: React.FC<HeaderProps> = ({ openLogin, register }) => {
  const { user, isAuthLoaded } = useAuthStore();
  // 3. Инициализируем функцию навигации
  const navigate = useNavigate();

  // 4. Пишем функцию для выхода
  const handleLogOut = async () => {
    try {
      await signOut(auth); // Разрываем сессию в Firebase
      toast.success('Ви успішно вийшли з системи'); // Показываем тост
      navigate('/'); // Перекидываем на главную страницу
    } catch (error: any) {
      toast.error('Помилка при виході: ' + error.message);
    }
  };

  return (
    <header>
      <div className={css.container}>
        
        <NavLink to="/" className={css.logo}>
             <img src={ukraineImg} alt="Ukraine Logo" width={28} height={28} />
             <span className={css.logoName}>Learn Lingo</span>
        </NavLink>
         
        <nav className={css.navigation}>
          <NavLink to="/" className={css.linkHome}>Home</NavLink>
          <NavLink to="/teachers" className={css.linkTeachers}>Teachers</NavLink>
        </nav>

        <div className={css.authBlock}>
          {!isAuthLoaded ? (
            <span>Завантаження...</span> 
          ) : user ? (
            <>
              <span className={css.userName}>
                 Привіт, {user.displayName || user.email}!
              </span>
          
              <button 
                type="button" 
                className={css.regButton} 
                onClick={handleLogOut} 
              >
                Log out
              </button> 
            </>
          ) : (
            <>
              <button type="button" className={css.loginButton} onClick={openLogin}>
                <img src={LoginIcon} alt="Log in" width={20} height={20} />
                Log in
              </button>
             
              <button type="button" className={css.regButton} onClick={register}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;