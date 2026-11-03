import React, { useState } from 'react';
import css from './StudentCard.module.css';
import type { StudentCardData } from '../../../types';
import { BookNextSlotModal } from '../BookNextSlotModal';

interface StudentCardProps {
  student: StudentCardData;
}

const getInitials = (name: string) => {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const initials = getInitials(student.fullName);
  
  // ДОБАВЛЯЕМ СТЕЙТ ДЛЯ МОДАЛКИ:
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <div className={css.card}>
        <div className={css.header}>
          <div className={css.avatarWrapper}>
            {student.avatarUrl ? (
              <img src={student.avatarUrl} alt={student.fullName} className={css.avatar} />
            ) : (
              <div className={css.avatarFallback}>{initials}</div>
            )}
            <span className={css.onlineDot}></span>
          </div>
          
          <div className={css.info}>
            <h3 className={css.name}>{student.fullName}</h3>
            <p className={css.level}>
              {student.language} • #{student.level}
            </p>
          </div>
        </div>

        <div className={css.badgesRow}>
          <span className={css.badgeGray}>
            {student.lessonsTogether} {student.lessonsTogether === 1 ? 'lesson' : 'lessons'} together
          </span>
        </div>

        <div className={css.actionsRow}>
          <button 
            type="button" 
            className={css.btnBook}
            onClick={() => setIsBookingModalOpen(true)}
          >
            Book next slot
          </button>
          
          <button type="button" className={css.btnMessage}>Message student</button>
        </div>
      </div>

      {/* РЕНДЕРИМ МОДАЛКУ ЕСЛИ СТЕЙТ TRUE: */}
      {isBookingModalOpen && (
        <BookNextSlotModal 
          student={student} 
          closeModal={() => setIsBookingModalOpen(false)} 
        />
      )}
    </>
  );
};