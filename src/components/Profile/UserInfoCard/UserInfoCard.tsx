import React, { useRef, useState } from 'react'; 
import css from "./UserInfoCard.module.css";
import { useAuthStore } from '../../../store/authStore';
import CameraIcon from "../../../assets/images/camera.svg";

// 1. ДОБАВЛЯЕМ ИНТЕРФЕЙС
interface UserInfoProps {
  onEditClick?: () => void;
}

// 2. ДОБАВЛЯЕМ ТИП И ДОСТАЕМ ПРОПС
export const UserInfoCard: React.FC<UserInfoProps> = ({ onEditClick }) => {
    const { user, userRole, userData } = useAuthStore();
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // 1. Имя
    const displayFirstName = userData?.firstName || "";
    const displayLastName = userData?.lastName || "";
    const fullName = (displayFirstName || displayLastName) 
        ? `${displayFirstName} ${displayLastName}`.trim() 
        : userData?.displayName || user?.displayName || 'User';
    
    // 2. Роль
    const displayRole = userRole 
        ? userRole.charAt(0).toUpperCase() + userRole.slice(1) 
        : 'Student';
    
    const actionText = userRole === 'teacher' ? 'Teaches:' : 'Learns:';
    
    // 3. Данные (если пустые, пишем 'Not set')
    const displayLanguage = userData?.language || 'Not set';
    const displayLevel = userData?.specializationLevel || userData?.currentLevel || 'Not set';
    
    // У студента цены нет, поэтому показываем только для учителя
    const displayPrice = (userRole === 'teacher' && userData?.hourlyRate) 
        ? ` • $${userData.hourlyRate}/hr` 
        : '';
    
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=FBE9BA&color=121417&size=128&bold=true`;
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
       <div className={css.cardWrapper}>
          <div className={css.avatarWrapper}>
              <img className={css.avatar} src={displayAvatar} alt={fullName}/>
              <button className={css.cameraBtn} type="button" onClick={handleCameraClick}>
                <img src={CameraIcon} alt="CameraIcon" width={16} height={16}/>
              </button>
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
              />
          </div>

          <div className={css.infoWrapper}>
            <div className={css.nameRow}>
               <h2 className={css.name}>{fullName}</h2>
               <span className={css.roleBadge}>{displayRole}</span>
            </div>
            
            {/* ТЕПЕРЬ СТРОЧКА ВЫВОДИТСЯ ВСЕГДА */}
            <div className={css.levelBadge}>
                {actionText} {displayLanguage} • Level: {displayLevel}{displayPrice}
            </div>
            
            {/* 3. ВЕШАЕМ ФУНКЦИЮ НА КНОПКУ */}
            <button 
                type="button" 
                className={css.editBtn} 
                onClick={onEditClick}
            >
                Edit profile
            </button>
          </div>
       </div>
    );
};