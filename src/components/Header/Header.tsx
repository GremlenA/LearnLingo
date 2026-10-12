import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import css from "./Header.module.css";
import LoginIcon from "../../assets/images/log-in-01.svg";
import ukraineImg from "../../assets/images/ukraine.svg";
import UserIcon from "../../assets/images/UserIcon.svg";
import { useAuthStore } from '../../store/authStore';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/getFirestore'; 
import toast from 'react-hot-toast'; 

interface HeaderProps {
  openLogin: () => void;
  register: () => void;
}

export const Header: React.FC<HeaderProps> = ({ openLogin, register }) => {
  const { user, isAuthLoaded } = useAuthStore();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await signOut(auth); 
      toast.success('Ви успішно вийшли з системи'); 
      navigate('/'); 
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
              <NavLink 
                to="/profile" 
                className={css.profileLink}
                title={user.displayName || user.email || "Профіль"}
              >
                <img src={UserIcon} alt="User Profile" width={32} height={32} />
              </NavLink>
          
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