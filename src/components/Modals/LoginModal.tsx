import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import css from './Login.module.css';
import { loginSchema } from "../../schemas/authSchemas"; 
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from 'react-hot-toast';
import { auth, db, googleProvider, facebookProvider } from "../../firebase/getFirestore";

// Добавляем импорты картинок из папки src/assets/images
import closeImg from "../../assets/images/close.svg";
import gmailImg from "../../assets/images/icon-gmail.svg";
import facebookImg from "../../assets/images/icon-facebook.svg";

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

  const onSubmit: SubmitHandler<IForm> = async(data) => {
     try {
        await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        closeModal();
        toast.success(`Вітаємо, ${data.email}! Авторизація успішна.`);
     } catch(error:any) {
       let customErrorMessage = "Сталася невідома помилка. Спробуйте пізніше.";
       switch (error.code) {
      case "auth/user-not-found":
        customErrorMessage = "Користувача з таким email не знайдено.";
        break;
      case "auth/wrong-password":
        customErrorMessage = "Невірний пароль.";
        break;
      case "auth/invalid-credential":
        customErrorMessage = "Невірний email або пароль.";
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

  
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "Google User",
          email: user.email,
          favorites: []
        });
      }

      closeModal(); 
      toast.success(`Вітаємо, ${user.displayName || user.email}! Успішний вхід.`);
      
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Ви закрили вікно авторизації.");
      } else {
        toast.error("Помилка авторизації: " + error.message);
      }
    }
  };

  const handleFaceBookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "Facebook User",
          email: user.email || "", 
          favorites: []
        });
      }

      closeModal(); 
      
      toast.success(`Вітаємо, ${user.displayName || "Користувач"}! Успішний вхід.`);
      
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Ви закрили вікно авторизації.");
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error("Акаунт з таким email вже існує. Увійдіть через Google або пошту.");
      } else {
        toast.error("Помилка авторизації: " + error.message);
      }
    }
  }; 

  return (
    <div className={css.backdrop} onClick={closeModal}>
      <div className={css.popUp} onClick={(e) => e.stopPropagation()}>
        
        <button type="button" className={css.closeButton} onClick={closeModal}>
            {/* Используем импортированную переменную */}
            <img src={closeImg} alt="Close" />
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

          <button type="button" className={css.gmailButton} onClick={handleGoogleSignIn}>
              {/* Используем импортированную переменную */}
              <img src={gmailImg} alt="Google" width={25} height={25} />
          </button>

          <button type="button" className={css.faceButton} onClick={handleFaceBookSignIn}>
              {/* Используем импортированную переменную */}
              <img src={facebookImg} alt="Facebook" width={25} height={25} />
          </button>
        </form>
      </div>
    </div>
  );
};