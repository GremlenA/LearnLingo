import css from './Profile.module.css';
import { UserInfoCard } from '../../components/Profile/UserInfoCard/UserInfoCard';
import { NextLessonBanner } from '../../components/Profile/NextLessonBanner/NextLessonBanner';
import { useAuthStore } from '../../store/authStore';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const userName = user?.displayName || 'Артем Педенко';
  const userPhoto = user?.photoURL || '';

  const mockLessonDate = new Date();
  mockLessonDate.setMinutes(mockLessonDate.getMinutes() + 41);

  return(
    <div className={css.pageWrapper}>
      <div className={css.container}>
      
        <section className={css.topRow}>
          <UserInfoCard />
          <NextLessonBanner 
             teacherName={userName} 
             teacherAvatarUrl={userPhoto}
             subject="English — Conversational & Business"
             lessonType="Regular Lesson"
             startTime={mockLessonDate}
             durationMinutes={60}
          />
        </section>

      </div>
    </div>
  );
};