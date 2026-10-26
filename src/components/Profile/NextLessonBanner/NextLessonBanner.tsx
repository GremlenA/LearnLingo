import React, { useState, useEffect } from 'react';
import css from './NextLessonBanner.module.css';
import VideoIcon from '../../../assets/images/video.svg'; 

interface NextLessonProps {
  // Универсальные пропсы для второго участника урока
  participantName: string;
  participantAvatarUrl?: string; 
  subject: string;
  lessonType: string;
  startTime: Date; 
  durationMinutes: number;
  meetingUrl?: string; // Добавлена ссылка на встречу
}

export const NextLessonBanner: React.FC<NextLessonProps> = ({
  participantName,
  participantAvatarUrl,
  subject,
  lessonType,
  startTime,
  durationMinutes,
  meetingUrl // Не забываем достать из пропсов
}) => {
  // Динамический стейт для таймера
  const [minutesUntilStart, setMinutesUntilStart] = useState(0);

  // Эффект для обновления таймера каждую минуту
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const timeDiffMs = startTime.getTime() - now.getTime();
      setMinutesUntilStart(Math.max(0, Math.floor(timeDiffMs / (1000 * 60))));
    };

    calculateTime(); // Вычисляем сразу при рендере
    const interval = setInterval(calculateTime, 60000); // Обновляем раз в минуту

    return () => clearInterval(interval); // Очищаем интервал при размонтировании
  }, [startTime]);

  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeString = `${formatTime(startTime)}–${formatTime(endTime)}`;

  // Генерация аватарки на основе универсального имени
  const avatar = participantAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(participantName)}&background=F4C550&color=121417&size=64&bold=true`;

  // Логика перехода по ссылке
  const handleJoinLesson = () => {
    if (meetingUrl) {
      window.open(meetingUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('Ссылка на урок еще не добавлена.');
    }
  };

  return (
    <div className={css.bannerWrapper}>
      
      <div className={css.statusRow}>
        <div className={css.statusBadge}>
          <span className={css.greenDot}></span>
          Starts in {minutesUntilStart} min
        </div>
        <div className={css.typeBadge}>
          {lessonType} ({durationMinutes} min)
        </div>
      </div>

      <div className={css.infoRow}>
        
        <div className={css.teacherInfo}>
           <img src={avatar} alt={participantName} className={css.avatar} />
           <div className={css.textBlock}>
              <h3>{participantName}</h3>
              <p className={css.subject}>{subject}</p>
              <p className={css.time}>Today • {timeString}</p>
           </div>
        </div>

        <div className={css.actionButtons}>
            <button type="button" className={css.joinBtn} onClick={handleJoinLesson}>
               <img src={VideoIcon} alt="Join" width={20} height={20} />
               Join Lesson
            </button>
            <button type="button" className={css.rescheduleBtn}>
               Reschedule
            </button>
        </div>

      </div>
    </div>
  );
};