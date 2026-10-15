import React from 'react';
import css from './NextLessonBanner.module.css';
 import VideoIcon from '../../../assets/images/video.svg'; 

interface NextLessonProps {
  teacherName: string;
  teacherAvatarUrl?: string; 
  subject: string;
  lessonType: string;
  startTime: Date; 
  durationMinutes: number;
}

export const NextLessonBanner: React.FC<NextLessonProps> = ({
  teacherName,
  teacherAvatarUrl,
  subject,
  lessonType,
  startTime,
  durationMinutes
}) => {


  const now = new Date();
  const timeDiffMs = startTime.getTime() - now.getTime();
  const minutesUntilStart = Math.max(0, Math.floor(timeDiffMs / (1000 * 60))); 
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeString = `${formatTime(startTime)}–${formatTime(endTime)}`;


  const initials = teacherName.split(' ').map(n => n[0]).join('').toUpperCase();
  const avatar = teacherAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=F4C550&color=121417&size=64&bold=true`;


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
           <img src={avatar} alt={teacherName} className={css.avatar} />
           <div className={css.textBlock}>
              <h3>{teacherName}</h3>
              <p className={css.subject}>{subject}</p>
              <p className={css.time}>Today • {timeString}</p>
           </div>
        </div>

    
        <div className={css.actionButtons}>
            <button type="button" className={css.joinBtn}>
               {<img src={VideoIcon} alt="Join" width={20} height={20} />}
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