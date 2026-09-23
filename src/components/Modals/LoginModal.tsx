import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import css from './Login.module.css';
import { loginSchema } from "../../schemas/authSchemas"; 

interface LoginProps {
  closeModal: () => void;
}

interface IForm {
  email: string;
  password: string;
}

export const Login: React.FC<LoginProps> = ({ closeModal }) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);
  };

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<IForm>({
    mode: "onChange",
    resolver: yupResolver(loginSchema) 
  });

  const onSubmit: SubmitHandler<IForm> = (data) => {
    console.log("Успешно!", data);
  };

  return (
    <div className={css.backdrop} onClick={closeModal}>
      <div className={css.popUp} onClick={(e) => e.stopPropagation()}>
        
        <button type="button" className={css.closeButton} onClick={closeModal}>
            <img src="./close.svg" alt="Close" />
        </button>

        <h2 className={css.loginH2}>Log In</h2>
        <p className={css.supportingText}>
          Welcome back! Please enter your credentials to access your account and continue your search for a teacher.
        </p>

        <form className={css.inputs} onSubmit={handleSubmit(onSubmit)}>
          <input 
            className={css.inputField}
            type="email" 
            placeholder="Email" 
            {...register('email')} 
          />
          {errors.email && <p className={css.errorText}>{errors.email.message}</p>}

          <input 
            className={css.inputField} 
            type="password"
            placeholder="Password" 
            {...register('password')} 
          />
          {errors.password && <p className={css.errorText}>{errors.password.message}</p>}
          
          <button 
            type="submit" 
            className={css.buttonLogin}
            onMouseMove={handleMouseMove} 
          >
            <span className={css.buttonText}>Log In</span>
          </button>
        </form>
      </div>
    </div>
  );
};