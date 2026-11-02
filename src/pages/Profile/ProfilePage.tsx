import css from './Profile.module.css';
import { UserInfoCard } from '../../components/Profile/UserInfoCard/UserInfoCard';
import { NextLessonBanner } from '../../components/Profile/NextLessonBanner/NextLessonBanner';
import { useAuthStore } from '../../store/authStore';
import { ProfileTabs } from '../../components/ProfileTabs/ProfileTabs';

export const ProfilePage = () => {
  // Достаем и user (из Google/FB), и userData (из нашей базы Firebase)
  const { user, userData } = useAuthStore();
  
  // 1. Умное формирование имени:
  // Сначала проверяем, заполнил ли человек имя в Settings. Если нет — берем из Google. Если и там нет — пишем 'User'
  const fullName = (userData?.firstName || userData?.lastName) 
    ? `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim()
    : userData?.displayName || user?.displayName || 'User';

  // 2. Аватарка: берем из Google, а если нет — генерируем кружок с инициалами
  const userPhoto = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=FBE9BA&color=121417&size=128&bold=true`;

  const mockLessonDate = new Date();
  mockLessonDate.setMinutes(mockLessonDate.getMinutes() + 41);

  return(
    <div className={css.pageWrapper}>
      <div className={css.container}>
      
        <section className={css.topRow}>
          {/* Эта карточка должна тянуть данные внутри себя */}
          <UserInfoCard />

          <NextLessonBanner
            participantName={fullName}
            participantAvatarUrl={userPhoto}
            subject="English — Conversational & Business"
            lessonType="Regular Lesson"
            startTime={mockLessonDate}
            durationMinutes={60}
          />
        </section>
        
        <ProfileTabs />
      </div>
    </div>
  );
};