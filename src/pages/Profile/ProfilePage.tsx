import css from './Profile.module.css';
import { UserInfoCard } from '../../components/Profile/UserInfoCard/UserInfoCard';
import { NextLessonBanner } from '../../components/Profile/NextLessonBanner/NextLessonBanner';

export const ProfilePage = () => {
  const mockLessonDate = new Date();
  mockLessonDate.setMinutes(mockLessonDate.getMinutes() + 42);

  return(
    <div className={css.pageWrapper}>
      <div className={css.container}>
        
        <section className={css.topRow}>
          {/* Левая карточка профиля */}
          <UserInfoCard />

          {/* Правая карточка следующего урока */}
          <NextLessonBanner 
             teacherName="Jane Smith"
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