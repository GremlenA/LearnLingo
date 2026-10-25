import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useTeacherStore } from "../../store/teacherStore";
import css from "./ProfileTabs.module.css";
// Импорт компонентов контента (пока есть только ProgressTab, остальные можно добавить позже)
import { ProgressTab } from "../ProgressTab/ProgressTab";

export const ProfileTabs = () => {
  // Достаем роль и данные профиля (нужно для студента)
  const { userData, userRole } = useAuthStore();
  
  // Достаем массивы данных преподавателя из отдельного стора
  const { upcomingLessons, myStudents, reviews } = useTeacherStore();

  // Устанавливаем вкладку по умолчанию: расписание для учителя, прогресс для ученика
  const [activeTab, setActiveTab] = useState(userRole === 'teacher' ? "schedule" : "progress");

  // --- ДАННЫЕ ДЛЯ СТУДЕНТА ---
  const favoritesCount = userData?.favorites?.length || 0;
  
  const studentTabs = [
    { id: "progress", label: "📊 Learning Progress" },
    { id: "lessons", label: "📆 My Lessons" },
    { id: "favorites", label: `❤️ Favorites (${favoritesCount})` },
    { id: "settings", label: "⚙️ Settings & Billing" },
  ];

  // --- ДАННЫЕ ДЛЯ ПРЕПОДАВАТЕЛЯ ---
  // Считаем реальное количество элементов на основе загруженных массивов
  const scheduleCount = upcomingLessons?.length || 0;
  const studentsCount = myStudents?.length || 0;
  const reviewsCount = reviews?.length || 0;

  const teacherTabs = [
    { id: "schedule", label: `📚 My Schedule (${scheduleCount})` },
    { id: "students", label: `👥 My Students (${studentsCount})` },
    { id: "reviews", label: `⭐ Reviews (${reviewsCount})` },
    { id: "earnings", label: "💰 Earnings" },
    { id: "settings", label: "⚙️ Settings" },
  ];

  // Выбираем нужный массив кнопок в зависимости от того, кто вошел
  const currentTabs = userRole === 'teacher' ? teacherTabs : studentTabs;

  // Функция для отрисовки разного контента
  const renderContent = () => {
    if (userRole === 'teacher') {
      // Контент для преподавателя
      switch (activeTab) {
        case "schedule":
          return <div className={css.tabPanel}>Здесь будет компонент расписания (My Schedule)</div>;
        case "students":
          return <div className={css.tabPanel}>Здесь будет список студентов (My Students)</div>;
        case "reviews":
          return <div className={css.tabPanel}>Здесь будут отзывы (Reviews)</div>;
        case "earnings":
          return <div className={css.tabPanel}>Здесь будет статистика доходов (Earnings)</div>;
        case "settings":
          return <div className={css.tabPanel}>Настройки преподавателя</div>;
        default:
          return <div className={css.tabPanel}>Здесь будет компонент расписания</div>;
      }
    } else {
      // Контент для студента
      switch (activeTab) {
        case "progress":
          return <ProgressTab />;
        case "lessons":
          return <div className={css.tabPanel}>Здесь будут уроки студента</div>;
        case "favorites":
          return <div className={css.tabPanel}>Здесь будут избранные репетиторы</div>;
        case "settings":
          return <div className={css.tabPanel}>Настройки студента</div>;
        default:
          return <ProgressTab />;
      }
    }
  };

  return (
    <div className={css.tabsWrapper}>
      {/* Навигация (кнопки вкладок) */}
      <div className={css.tabsNavigation}>
        {currentTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${css.tabButton} ${activeTab === tab.id ? css.activeTab : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Область контента выбранной вкладки */}
      <div className={css.tabContentArea}>{renderContent()}</div>
    </div>
  );
};