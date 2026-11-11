import React, { useState, useMemo } from 'react';
import css from './MyStudentsTab.module.css';
import { useAuthStore } from '../../store/authStore';
import { useTeacherStudents } from '../../hooks/useTeacherStudents';
import { StudentCard } from './StudentCard/StudentCard';

export const MyStudentsTab = () => {
  const { user } = useAuthStore();
  const { students, loading, error } = useTeacherStudents(user?.uid);

  // Стейты для выбранных значений фильтров
  const [langFilter, setLangFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [activityFilter, setActivityFilter] = useState('Recent');
  const [visibleCount, setVisibleCount] = useState(10);

  React.useEffect(() => {
    setVisibleCount(10);
  }, [langFilter, levelFilter, activityFilter]);
  
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // 1. Фильтр по языку
    if (langFilter !== 'All') {
      result = result.filter(student => 
        student.language.toLowerCase().includes(langFilter.toLowerCase())
      );
    }

    // 2. Фильтр по уровню
    if (levelFilter !== 'All') {
      result = result.filter(student => 
        student.level.toLowerCase().includes(levelFilter.toLowerCase())
      );
    }

    // 3. Сортировка по активности
    if (activityFilter === 'Most lessons') {
      result.sort((a, b) => b.lessonsTogether - a.lessonsTogether);
    } else if (activityFilter === 'Recent') {
    
    }

    return result;
  }, [students, langFilter, levelFilter, activityFilter]);

  // Массив, который реально пойдет на экран
  const studentsToShow = filteredStudents.slice(0, visibleCount);
  
  const availableLanguages = ['All', ...Array.from(new Set(students.map(s => s.language)))];
  const availableLevels = ['All', ...Array.from(new Set(students.map(s => s.level)))];

  if (loading) {
    return <div className={css.statusMessage}>Loading your students...</div>;
  }

  if (error) {
    return <div className={css.statusMessage}>{error}</div>;
  }

  return (
    <div className={css.container}>
      
      {/* Секция фильтров */}
      <div className={css.filters}>
        <select 
          className={css.filterSelect}
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
        >
          {availableLanguages.map(lang => (
            <option key={lang} value={lang}>
              {lang === 'All' ? 'Language: All' : lang}
            </option>
          ))}
        </select>

        <select 
          className={css.filterSelect}
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          {availableLevels.map(level => (
            <option key={level} value={level}>
              {level === 'All' ? 'Level: All' : level}
            </option>
          ))}
        </select>

        <select 
          className={css.filterSelect}
          value={activityFilter}
          onChange={(e) => setActivityFilter(e.target.value)}
        >
          <option value="Recent">Activity: Recent</option>
          <option value="Most lessons">Most lessons together</option>
        </select>

        <button 
          className={css.resetFilter}
          onClick={() => {
              setLevelFilter('All');
              setLangFilter('All');
              setActivityFilter('Recent'); 
          }}
        >
          Reset
        </button>
      </div>

      {/* Сетка карточек студентов */}
      {students.length === 0 ? (
        <div className={css.statusMessage}>You have no students yet.</div>
      ) : filteredStudents.length === 0 ? (
        <div className={css.statusMessage}>No students match your filters.</div>
      ) : (
        <div className={css.grid}>
    
          {studentsToShow.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}

      {/* Кнопка Load More */}
      {visibleCount < filteredStudents.length && (
        <div className={css.loadMoreWrapper}>
          <button 
            className={css.loadMoreBtn} 
            onClick={() => setVisibleCount((prev) => prev + 10)}
          >
            Load more students
          </button>
        </div>
      )}
      
    </div>
  );
};