import React, { useEffect } from 'react';
import { useForm,  type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import css from './Register.module.css';
import { registerSchema } from "../../schemas/authSchemas"; 
import { auth, db } from "../../firebase/getFirestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast';


interface RegisterProps {
  closeModal: () => void;
}

interface IForm {
  email: string;
  password: string;
  name: string;
}

export const Register: React.FC<RegisterProps> = ({ closeModal }) => {

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
      // 1. Создаем аккаунт в системе авторизации
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // 2. Добавляем имя к профилю авторизации
      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      // 3. НОВОЕ: Создаем документ в базе данных Firestore!
      // doc() указывает ГДЕ создать: в базе db, в коллекции "users", с названием файла = user.uid
      // setDoc() указывает ЧТО туда положить (объект с данными)
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: data.name,
        email: data.email,
        createdAt: new Date().toISOString(), // Добавляем дату регистрации для порядка
        favorites: [] // Сразу создаем пустой массив для будущих избранных учителей
      });

      // 4. Закрываем окно
      closeModal();
      toast.success(`Вітаємо, ${data.name}! Реєстрація успішна.`);
    } catch (error: any) {
      // Создаем переменную для нашего красивого сообщения
      let customErrorMessage = "Сталася невідома помилка. Спробуйте пізніше.";

      // Проверяем код ошибки от Firebase и меняем текст
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
          // Если код ошибки нам неизвестен, выводим стандартное сообщение Firebase
          customErrorMessage = error.message;
      }

      // Передаем в тост нашу красивую переменную
      toast.error(customErrorMessage);
    }
  };

  return (
    <div className={css.backdrop} onClick={closeModal}>
      <div className={css.popUp} onClick={(e) => e.stopPropagation()}>
        
        <button type="button" className={css.closeButton} onClick={closeModal}>
            <img src="./close.svg" alt="Close" />
        </button>

        <h2 className={css.registerH2}>Registration</h2>
        <p className={css.supportingText}>
          Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information
        </p>

        <form className={css.inputs} onSubmit={handleSubmit(onSubmit)}>
            <input 
            className={css.inputField}
            type="name" 
            placeholder="Name" 
            {...register('name')} 
          />
          {errors.email && <p className={css.errorText}>{errors.email.message}</p>}
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