import React from "react"; // хук useState здесь больше не нужен
import { useAuthStore } from "../../store/authStore";
import { useTeacherStore } from "../../store/teacherStore";
import { useTeacherStudents } from "../../hooks/useTeacherStudents"; 
import css from "./ProfileTabs.module.css";
import { ProgressTab } from "../ProgressTab/ProgressTab";
import { ScheduleTab } from '../ScheduleTab/ScheduleTab';
import { SettingsTab } from "../Settings/SettingsTab";
import { MyStudentsTab } from '../MyStudents/MyStudentsTab';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
  const { userData, userRole, user } = useAuthStore();
  const { upcomingLessons, reviews } = useTeacherStore();
  const { students } = useTeacherStudents(user?.uid);
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