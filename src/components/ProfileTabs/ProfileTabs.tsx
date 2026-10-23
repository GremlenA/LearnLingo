import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import css from "./ProfileTabs.module.css";
import { ProgressTab } from "../ProgressTab/ProgressTab";

export const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("progress");
  const { userData } = useAuthStore();

  const favoritesCount = userData?.favorites?.length || 0;

  const tabs = [
    { id: "progress", label: "📊 Learning Progress" },
    { id: "lessons", label: "📆 My Lessons " },
    { id: "favorites", label: `❤️ Favorites (${favoritesCount})` },
    { id: "settings", label: "⚙️ Settings & Billing" },
  ];

  const renderContent = () => {
    // Говорим: "Проверяй значение переменной activeTab"
    switch (activeTab) {
      case "progress":
        return <ProgressTab />;

      case "lessons":
        return <div className={css.tabPanel}>Содержимое Lessons</div>;

      case "favorites":
        return <div className={css.tabPanel}>Содержимое Favorites</div>;

      case "settings":
        return <div className={css.tabPanel}>Содержимое Settings</div>;

      default:
        return <div className={css.tabPanel}>Содержимое Progress</div>;
    }
  };

  return (
    <div className={css.tabsWrapper}>
      {/* Блок навигации кнопок */}
      <div className={css.tabsNavigation}>
        {tabs.map((tab) => (
          <button
            key={tab.id} // React всегда просит уникальный ключ для элементов списка
            onClick={() => setActiveTab(tab.id)} // При клике передаем id вкладки в стейт
            className={`${css.tabButton} ${activeTab === tab.id ? css.activeTab : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Блок динамического контента */}
      <div className={css.tabContentArea}>{renderContent()}</div>
    </div>
  );
};
