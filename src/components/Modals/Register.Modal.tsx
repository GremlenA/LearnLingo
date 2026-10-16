import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import css from './Register.module.css';
import { registerSchema } from "../../schemas/authSchemas"; 
import { toast } from "react-hot-toast";

// Берем стор
import { useAuthStore } from '../../store/authStore';

import closeImg from "../../assets/images/close.svg";

interface RegisterProps {
  closeModal: () => void;
}

// 1. Расширяем интерфейс формы (делаем поля необязательными, так как они нужны только учителю)
interface IForm {
  email: string;
  password: string;
  name: string;
  language?: string;
  level?: string;
  price?: number;
}

export const Register: React.FC<RegisterProps> = ({ closeModal }) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  
  // Достаем нашу мощную функцию из стора
  const { registerWithEmail } = useAuthStore();

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
    resolver: yupResolver(registerSchema)
  });

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    try {
      // 2. Собираем дополнительные данные, если выбрана роль учителя
      const extraData = selectedRole === 'teacher' 
        ? { 
            language: data.language || 'English', 
            level: data.level || 'B2 Upper-Intermediate',
            price: data.price || 0
          } 
        : {};

      // 3. Передаем extraData пятым аргументом
      await registerWithEmail(data.email, data.password, selectedRole, data.name, extraData);

      closeModal();
      toast.success(`Вітаємо, ${data.name}! Реєстрація успішна.`);
    } catch (error: any) {
      let customErrorMessage = "Сталася невідома помилка. Спробуйте пізніше.";

      switch (error.code) {
        case "auth/email-already-in-use":
          customErrorMessage = "Користувач з таким email вже існує!";
          break;
        case "auth/invalid-email":
          customErrorMessage = "Невірний формат email адреси.";
          break;
        case "auth/weak-password":
          customErrorMessage = "Пароль занадто простий. Мінімум 6 символів.";
          break;
        case "auth/network-request-failed":
          customErrorMessage = "Помилка мережі. Перевірте інтернет-з'єднання.";
          break;
        default:
          customErrorMessage = error.message;
      }

      toast.error(customErrorMessage);
    }
  };

  return (
    <div className={css.backdrop} onClick={closeModal}>
      <div className={css.popUp} onClick={(e) => e.stopPropagation()}>
        
        <button type="button" className={css.closeButton} onClick={closeModal}>
            <img src={closeImg} alt="Close" />
        </button>

        <h2 className={css.registerH2}>Registration</h2>
        <p className={css.supportingText}>
          Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information
        </p>

        <div className={css.roleSelector}>
          <label className={`${css.roleLabel} ${selectedRole === 'student' ? css.activeRole : ''}`}>
            <input 
              type="radio" 
              name="role" 
              value="student" 
              className={css.hiddenRadio}
              checked={selectedRole === 'student'} 
              onChange={() => setSelectedRole('student')} 
            />
            I am a Student
          </label>
          
          <label className={`${css.roleLabel} ${selectedRole === 'teacher' ? css.activeRole : ''}`}>
            <input 
              type="radio" 
              name="role" 
              value="teacher" 
              className={css.hiddenRadio}
              checked={selectedRole === 'teacher'} 
              onChange={() => setSelectedRole('teacher')} 
            />
            I am a Teacher
          </label>
        </div>

        <form className={css.inputs} onSubmit={handleSubmit(onSubmit)}>
          <input 
            className={css.inputField}
            type="text" 
            placeholder="Name" 
            {...register('name')} 
          />
          {errors.name && <p className={css.errorText}>{errors.name.message}</p>}
          
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
          
          {/* 4. ДОБАВЛЯЕМ НОВЫЕ ПОЛЯ ТОЛЬКО ДЛЯ УЧИТЕЛЯ */}
          {selectedRole === 'teacher' && (
            <div className={css.teacherFieldsContainer}>
              <h3 className={css.teacherFieldsTitle}>Teacher Details</h3>
              <div className={css.teacherInputsRow}>
                <input 
                  className={`${css.inputField} ${css.halfWidth}`}
                  type="text" 
                  placeholder="Language (e.g. English)" 
                  {...register('language')} 
                />
                <input 
                  className={`${css.inputField} ${css.halfWidth}`}
                  type="number" 
                  placeholder="Price/hr ($)" 
                  {...register('price')} 
                />
              </div>
              <input 
                className={css.inputField}
                type="text" 
                placeholder="Level (e.g. B2 Upper-Intermediate)" 
                {...register('level')} 
              />
            </div>
          )}

          <button 
            type="submit" 
            className={css.buttonRegister}
            onMouseMove={handleMouseMove} 
          >
            <span className={css.buttonText}>Sign Up</span>
          </button>
        </form>
      </div>
    </div>
  );
};