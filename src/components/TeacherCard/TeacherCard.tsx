import { useState } from "react";
import css from "./TeacherCard.module.css";

// 1. Возвращаем интерфейсы, чтобы TypeScript знал структуру наших пропсов
export interface Review {
  reviewer_name: string;
  reviewer_rating: number;
  comment: string;
}

export interface TeacherProps {
  name: string;
  surname: string;
  languages: string[];
  levels: string[];
  rating: number;
  reviews: Review[];
  price_per_hour: number;
  lessons_done: number;
  avatar_url: string;
  lesson_info: string;
  conditions: string[];
  experience: string;
}

// 2. Сам компонент карточки
export const TeacherCard = ({
  name,
  surname,
  languages,
  levels,
  rating,
  price_per_hour,
  lessons_done,
  avatar_url,
  lesson_info,
  conditions,
  experience,
}: TeacherProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={css.card}>
      {/* ЛЕВАЯ КОЛОНКА (Только аватарка) */}
      <div className={css.avatarWrapper}>
        <img
          className={css.avatar}
          src={avatar_url}
          alt={`${name} ${surname}`}
        />
        
      </div>

      {/* ПРАВАЯ КОЛОНКА (Весь текст) */}
      <div className={css.contentWrapper}>
        
        {/* Шапка: Имя и статистика */}
        <div className={css.header}>
          
          {/* Верхняя строка с надписью Languages, статистикой и сердечком */}
          <div className={css.topRow}>
            <span className={css.languagesLabel}>Languages</span>

            {/* Блок статистики */}
            <ul className={css.stats}>
              <li className={css.statItem}>
                <svg className={css.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3.5C2 3.22386 2.22386 3 2.5 3H7.5C7.77614 3 8 3.22386 8 3.5V13.5C8 13.7761 7.77614 14 7.5 14H2.5C2.22386 14 2 13.7761 2 13.5V3.5Z" stroke="#121417" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M8 3.5C8 3.22386 8.22386 3 8.5 3H13.5C13.7761 3 14 3.22386 14 3.5V13.5C14 13.7761 13.7761 14 13.5 14H8.5C8.22386 14 8 13.7761 8 13.5V3.5Z" stroke="#121417" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                Lessons online
              </li>
              <li className={css.statItem}>
                Lessons done: {lessons_done}
              </li>
              <li className={css.statItem}>
                <svg className={css.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1.5L10.163 5.7787L15 6.5152L11.5 9.836L12.326 14.5L8 12.2787L3.674 14.5L4.5 9.836L1 6.5152L5.837 5.7787L8 1.5Z" fill="#FFC531" stroke="#FFC531" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Rating: {rating}
              </li>
              <li className={css.statItem}>
                Price / 1 hour: <span className={css.priceValue}>{price_per_hour}$</span>
              </li>
            </ul>

            {/* Иконка избранного (Сердечко) */}
            <button className={css.favoriteBtn}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 22.5C13 22.5 3 16.5 3 9.5C3 6.46243 5.46243 4 8.5 4C10.5133 4 12.2721 5.0886 13 6.67138C13.7279 5.0886 15.4867 4 17.5 4C20.5376 4 23 6.46243 23 9.5C23 16.5 13 22.5 13 22.5Z" stroke="#121417" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <h2 className={css.name}>{name} {surname}</h2>
        </div>

        {/* Блок с информацией (Speaks, Lesson Info, Conditions) */}
        <div className={css.detailsWrapper}>
          <p className={css.detailsText}>
            <span className={css.label}>Speaks: </span>
            <span className={css.highlightedText}>{languages.join(", ")}</span>
          </p>
          <p className={css.detailsText}>
            <span className={css.label}>Lesson Info: </span>
            {lesson_info}
          </p>
          <p className={css.detailsText}>
            <span className={css.label}>Conditions: </span>
            {conditions.join(" ")}
          </p>
        </div>

        {/* Условный рендеринг: Кнопка "Read more" ИЛИ скрытый контент */}
        {!isExpanded ? (
          <button
            className={css.readMoreBtn}
            onClick={() => setIsExpanded(true)}
          >
            Read more
          </button>
        ) : (
          <div className={css.expandedContent}>
            <p className={css.experienceText}>{experience}</p>
          </div>
        )}

        {/* Теги уровней */}
        <div className={css.levelsWrapper}>
          {levels.map((level) => (
            <span key={level} className={css.levelTag}>
              #{level}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};