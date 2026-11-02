import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form"; 
import css from "./PersonalInfoFields.module.css";
import { useAuthStore } from "../../../store/authStore";
import CameraIcon from "../../../assets/images/camera.svg";

export const PersonalInfoFields = () => {
  // 1. Все хуки строго внутри компонента
  const { register, formState: { errors } } = useFormContext();
  const { user } = useAuthStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Достаем имя пользователя или ставим заглушку, чтобы fallbackAvatar не выдавал ошибку
  const userName = user?.displayName || "User Name"; 
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=FBE9BA&color=121417&size=128&bold=true`;
  const displayAvatar = previewUrl || user?.photoURL || fallbackAvatar;

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const localImageUrl = URL.createObjectURL(file);
    setPreviewUrl(localImageUrl);
  };

  return (
    <div className={css.personalInfoCard}>
      
      {/* --- Секция Аватара --- */}
      <div className={css.avatarSection}>
        <div className={css.avatarWrapper}>
          <img className={css.avatar} src={displayAvatar} alt={userName} />
          <button className={css.cameraBtn} type="button" onClick={handleCameraClick}>
            <img src={CameraIcon} alt="Camera" width={16} height={16} />
          </button>
        </div>

        <div className={css.avatarActions}>
          <button type="button" className={css.uploadBtn} onClick={handleCameraClick}>
            Upload photo
          </button>
          <button 
            type="button" 
            className={css.removeBtn} 
            onClick={() => setPreviewUrl(null)}
          >
            Remove
          </button>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          accept="image/png, image/jpeg, image/jpg, image/webp" 
        />
      </div>

      {/* --- Секция Инпутов (Сетка) --- */}
      <div className={css.fieldsGrid}>
        <div className={css.inputGroup}>
          <label>First name</label>
          <input type="text" {...register("firstName")} />
          {errors.firstName && <span className={css.error}>{errors.firstName.message as string}</span>}
        </div>

        <div className={css.inputGroup}>
          <label>Last name</label>
          <input type="text" {...register("lastName")} />
          {errors.lastName && <span className={css.error}>{errors.lastName.message as string}</span>}
        </div>

        <div className={css.inputGroup}>
          <label>Email</label>
          <input type="email" {...register("email")} />
          {errors.email && <span className={css.error}>{errors.email.message as string}</span>}
        </div>

        <div className={css.inputGroup}>
          <label>Phone</label>
          <input type="tel" {...register("phone")} />
          {errors.phone && <span className={css.error}>{errors.phone.message as string}</span>}
        </div>
      </div>
      
    </div>
  );
};