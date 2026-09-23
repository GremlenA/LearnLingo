import React from 'react';
import { NavLink } from 'react-router-dom';
import css from "./Header.module.css";
import LoginIcon from "../../../public/log-in-01.svg";


interface HeaderProps {
  openLogin: () => void;
  register: () => void;
}

// 2. Принимаем openLogin и register через деструктуризацию пропсов
export const Header: React.FC<HeaderProps> = ({ openLogin, register }) => {
  return (
    <header>
      <div className={css.container}>
        
        <NavLink to="/" className={css.logo}>
          <img
            src="/ukraine.svg"
            alt="Ukraine Logo"
            width={28}
            height={28}
          />
          <span className={css.logoName}>Learn Lingo</span>
        </NavLink>
         
        <nav className={css.navigation}>
          <NavLink to="/" className={css.linkHome}>
            Home
          </NavLink>
          <NavLink to="/teachers" className={css.linkTeachers}>
            Teachers
          </NavLink>
        </nav>

        <div className={css.authBlock}>
          {/* 3. Вешаем onClick на кнопку Log in */}
          <button 
            type="button" 
            className={css.loginButton} 
            onClick={openLogin}
          >
            <img 
              src={LoginIcon}
              alt="Log in"
              width={20}
              height={20}
            />
            Log in
          </button>
         
          <button type="button"
           className={css.regButton}
           onClick={register}
          >
            Register
          </button>
        </div>
        
      </div>
    </header>
  );
};

export default Header;