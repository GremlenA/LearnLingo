import React, { useRef, useState } from 'react'; 
import css from "./UserInfoCard.module.css";
import { useAuthStore } from '../../../store/authStore';
import CameraIcon from "../../../assets/images/camera.svg";

export const UserInfoCard = () => {
    const { user, userRole, userData } = useAuthStore();
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const userName = user?.displayName || 'User';
    
    const displayRole = userRole 
        ? userRole.charAt(0).toUpperCase() + userRole.slice(1) 
        : 'Student';
    
    // Динамический префикс в зависимости от роли
    const actionText = userRole === 'teacher' ? 'Teaches:' : 'Learns:';
    
    const displayLanguage = userData?.language;
    const displayLevel = userData?.level;
    const displayPrice = userData?.price ? ` • $${userData.price}/hr` : '';
    const displayTimezone = userData?.timezone || 'GMT+3'; // Берем из базы или ставим дефолт
    
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
        // Здесь в будущем нужно добавить функцию загрузки файла в Firebase Storage
    };

    return (
       <div className={css.cardWrapper}>
          <div className={css.avatarWrapper}>
              <img className={css.avatar} src={displayAvatar} alt={userName}/>
              
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
               <h2 className={css.name}>{userName}</h2>
               <span className={css.roleBadge}>{displayRole}</span>
            </div>
            
            {/* Рендерим блок только если язык и уровень есть в базе */}
            {(displayLanguage || displayLevel) && (
                <div className={css.levelBadge}>
                    {actionText} {displayLanguage} • Level: {displayLevel}{displayPrice}
                </div>
            )}
            
        
            
            <button type="button" className={css.editBtn}>Edit profile</button>
          </div>
       </div>
    );
};