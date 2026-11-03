import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useTeacherStore } from "../../store/teacherStore";
// ИСПРАВЛЕНИЕ 1: Импортируем наш хук для студентов
import { useTeacherStudents } from "../../hooks/useTeacherStudents"; 
import css from "./ProfileTabs.module.css";
import { ProgressTab } from "../ProgressTab/ProgressTab";
import { ScheduleTab } from '../ScheduleTab/ScheduleTab';
import { SettingsTab } from "../Settings/SettingsTab";
import { MyStudentsTab } from '../MyStudents/MyStudentsTab';

export const ProfileTabs = () => {
  // ИСПРАВЛЕНИЕ 2: Достаем user, чтобы получить его uid
  const { userData, userRole, user } = useAuthStore();
  const { upcomingLessons, reviews } = useTeacherStore();

  const [activeTab, setActiveTab] = useState(userRole === 'teacher' ? "schedule" : "progress");

  // ИСПРАВЛЕНИЕ 3: Вызываем хук и получаем реальный массив студентов
  const { students } = useTeacherStudents(user?.uid);
  
  // ИСПРАВЛЕНИЕ 4: Считаем реальное количество учеников
  const studentsCount = students.length; 

  const favoritesCount = userData?.favorites?.length || 0;
  const scheduleCount = upcomingLessons?.length || 0;
  const reviewsCount = reviews?.length || 0;

  const studentTabs = [
    { id: "progress", label: "📊 Learning Progress" },
    { id: "lessons", label: "📆 My Lessons" },
    { id: "favorites", label: `❤️ Favorites (${favoritesCount})` },
    { id: "settings", label: "⚙️ Settings & Billing" },
  ];

  const teacherTabs = [
    { id: "schedule", label: `📚 My Schedule (${scheduleCount})` },
    // Теперь здесь выводится живая цифра из базы данных
    { id: "students", label: `👥 My Students (${studentsCount})` }, 
    { id: "reviews", label: `⭐ Reviews (${reviewsCount})` },
    { id: "settings", label: "⚙️ Settings" },
  ];

  const currentTabs = userRole === 'teacher' ? teacherTabs : studentTabs;

  const renderContent = () => {
    if (userRole === 'teacher') {
      switch (activeTab) {
        case "schedule": return <ScheduleTab />; 
        case "students": return <MyStudentsTab />;
        case "reviews": return <div className={css.tabPanel}>Здесь будут отзывы (Reviews)</div>;
        case "earnings": return <div className={css.tabPanel}>Здесь будет статистика доходов (Earnings)</div>;
        case "settings": return <SettingsTab />; 
        default: return <ScheduleTab />;
      }
    } else {
      switch (activeTab) {
        case "progress": return <ProgressTab />;
        case "lessons": return <div className={css.tabPanel}>Здесь будут уроки студента</div>;
        case "favorites": return <div className={css.tabPanel}>Здесь будут избранные репетиторы</div>;
        case "settings": return <SettingsTab />;
        default: return <ProgressTab />;
      }
    }
  };

  return (
    <div className={css.tabsWrapper}>
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

      <div className={css.tabContentArea}>{renderContent()}</div>
    </div>
  );
};