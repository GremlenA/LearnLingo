import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/getFirestore'; 
import { useAuthStore } from '../../store/authStore';
// 1. ИСПРАВЛЕНО: Правильный импорт схем валидации
import { teacherProfileSchema, studentProfileSchema } from '../../schemas/profileSchemas'; 
// 2. ИСПРАВЛЕНО: Правильные относительные пути к компонентам внутри папки Settings
import { PersonalInfoFields } from './PersonalInfoFields/PersonalInfoFields';
import { TeachingPreferencesFields } from './TeachingPreferencesFields/TeachingPreferencesFields'; 
import { LearningPreferencesFields } from './LearningPreferencesFields/LearningPreferencesFields';

export const SettingsTab = () => {
  const { userRole, user, userData, updateUserData } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  // Выбираем схему в зависимости от роли
  const currentSchema = userRole === 'teacher' ? teacherProfileSchema : studentProfileSchema;

  // Достаем имя из Google/FB и разбиваем его на Имя и Фамилию
  const defaultFullName = userData?.displayName || user?.displayName || "";
  const nameParts = defaultFullName.trim().split(" ");
  const fallbackFirstName = nameParts[0] || ""; 
  const fallbackLastName = nameParts.slice(1).join(" ") || ""; 

  // Инициализируем форму
  const methods = useForm({
    resolver: yupResolver(currentSchema as any),
    mode: "onBlur",
    defaultValues: {
      firstName: userData?.firstName || fallbackFirstName,
      lastName: userData?.lastName || fallbackLastName,
      email: userData?.email || user?.email || "",
      phone: userData?.phone || "",
      language: userData?.language || "",
      specializationLevel: userData?.specializationLevel || "",
      currentLevel: userData?.currentLevel || "", 
      mainGoal: userData?.mainGoal || "",
      hourlyRate: userData?.hourlyRate || "",
    }
  });

  // Отправка данных
  const onSubmit = async (data: any) => {
    if (!user?.uid) return;

    setIsSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, data);

      // Обновляем локальный стейт, чтобы интерфейс мгновенно перерисовался
      updateUserData(data);

      alert("Profile successfully updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <PersonalInfoFields />

        {/* Если роль teacher — показываем его поля. Во всех остальных случаях — поля студента */}
        {userRole === 'teacher' ? (
          <TeachingPreferencesFields />
        ) : (
          <LearningPreferencesFields />
        )}

        <button 
          type="submit" 
          disabled={isSaving}
          style={{
            alignSelf: 'flex-start',
            padding: '16px 32px',
            backgroundColor: isSaving ? '#E8E8E9' : '#F4C550',
            color: isSaving ? '#8A8A89' : '#121417',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            marginTop: '16px'
          }}
        >
          {isSaving ? "Saving..." : "Save profile"}
        </button>

      </form>
    </FormProvider>
  );
};