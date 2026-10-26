// pages/TeacherDashboard/TeacherDashboard.tsx
import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTeacherStore } from '../../store/teacherStore';
import { UserInfoCard } from '../../components/Profile/UserInfoCard/UserInfoCard';
import { NextLessonBanner } from '../../components/Profile/NextLessonBanner/NextLessonBanner';
import { ProfileTabs } from '../../components/ProfileTabs/ProfileTabs';

export const TeacherDashboard = () => {
  const { user } = useAuthStore();
  const { fetchTeacherData, isLoading } = useTeacherStore();

  // Инициализация загрузки стартует здесь при открытии страницы
  useEffect(() => {
    if (user?.uid) {
      fetchTeacherData(user.uid);
    }
  }, [user?.uid, fetchTeacherData]);

  if (isLoading) return <div>Загрузка кабинета...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
         {/* Эти карточки просто отрисовывают UI */}
         <UserInfoCard />
         
         {/* Временно оставляем статичные данные, позже заменим на ближайший урок из базы */}
         <NextLessonBanner 
            participantName="Alex Kovalenko" 
            subject="English" 
            lessonType="Regular Lesson" 
            // Для наглядности таймера ставим время начала через 42 минуты
            startTime={new Date(Date.now() + 42 * 60000)} 
            durationMinutes={60} 
         />
      </div>
      
      {/* Вкладки автоматически подхватят загруженные данные из teacherStore. 
          А модальное окно и кнопка "+ Schedule Lesson" теперь живут внутри ProfileTabs -> ScheduleTab 
      */}
      <ProfileTabs />
      
    </div>
  );
};