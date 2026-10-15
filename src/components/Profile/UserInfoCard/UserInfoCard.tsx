import React, { useRef, useState } from 'react'; 
import css from "./UserInfoCard.module.css";
import { useAuthStore } from '../../../store/authStore';
import CameraIcon from "../../../assets/images/camera.svg";


export const UserInfoCard = () => {
    const { user } = useAuthStore();
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const userName = user?.displayName || 'Артем Педенко';
    const userRole = 'Student';
    const userEmail = user?.email || 'artem.pedenko@email.com';
    
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
               <span className={css.roleBadge}>{userRole}</span>
            </div>
            <div className={css.levelBadge}>English • #B2 Upper-Intermediate</div>
            <button type="button" className={css.editBtn}>Edit profile</button>
          </div>
       </div>
    );
};