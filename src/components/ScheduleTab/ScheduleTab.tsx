import React, { useState } from 'react';
import { ScheduleLessonModal } from '../ScheduleLessonModal/ScheduleLessonModal';
import css from './ScheduleTab.module.css';

export const ScheduleTab = () => {
  // Стейт для модального окна создания урока переехал сюда
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Стейт для фильтров (Upcoming, Completed, Canceled)
  const [activeFilter, setActiveFilter] = useState('upcoming');

  return (
    <div className={css.tabContainer}>
      
      {/* Верхний блок: Фильтры слева, кнопка создания урока справа */}
      <div className={css.controlsRow}>
        <div className={css.filters}>
          <button 
            className={`${css.filterBtn} ${activeFilter === 'upcoming' ? css.active : ''}`}
            onClick={() => setActiveFilter('upcoming')}
          >
            Upcoming (8)
          </button>
          <button 
            className={`${css.filterBtn} ${activeFilter === 'completed' ? css.active : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            Completed (120)
          </button>
          <button 
            className={`${css.filterBtn} ${activeFilter === 'canceled' ? css.active : ''}`}
            onClick={() => setActiveFilter('canceled')}
          >
            Canceled (3)
          </button>
        </div>

        <button className={css.createBtn} onClick={() => setIsModalOpen(true)}>
          + Schedule Lesson
        </button>
      </div>

      {/* Здесь будет рендериться список карточек уроков */}
      <div className={css.lessonsList}>
         <p style={{ color: '#8A8A8E' }}>Здесь скоро появятся карточки уроков...</p>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <ScheduleLessonModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};