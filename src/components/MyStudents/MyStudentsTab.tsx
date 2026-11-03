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

  // Логика фильтрации и сортировки (пересчитывается только при изменении студентов или фильтров)
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // 1. Фильтр по языку (или цели, так как в language мы сохраняем либо язык, либо reason)
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
      // Сортируем по количеству проведенных уроков (от большего к меньшему)
      result.sort((a, b) => b.lessonsTogether - a.lessonsTogether);
    } else if (activityFilter === 'Recent') {
      // По умолчанию хук возвращает их в порядке добавления/обновления (или можно оставить как есть)
      // Если бы у нас был lastLessonDate в StudentCardData, мы бы сортировали по нему
    }

    return result;
  }, [students, langFilter, levelFilter, activityFilter]);

  // Собираем уникальные языки и уровни из списка МОИХ студентов, чтобы в дропдаунах 
  // не было пустых опций (например, зачем выбирать Spanish, если таких учеников нет)
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
      </div>

      {/* Сетка карточек студентов */}
      {students.length === 0 ? (
        <div className={css.statusMessage}>You have no students yet.</div>
      ) : filteredStudents.length === 0 ? (
        <div className={css.statusMessage}>No students match your filters.</div>
      ) : (
        <div className={css.grid}>
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
};