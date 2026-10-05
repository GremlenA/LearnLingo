import { useState, useRef, useEffect } from "react";
import css from "./Teachers.module.css";

// Переиспользуемый компонент кастомного селекта
const CustomSelect = ({ label, options, value, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Закрытие списка при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={css.filterItem} ref={selectRef}>
      <label className={css.label}>{label}</label>
      
      {/* Кнопка открытия/закрытия */}
      <button
        type="button"
        className={`${css.selectButton} ${isOpen ? css.selectButtonOpen : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
      </button>

      {/* Выпадающий список */}
      {isOpen && (
        <ul className={css.dropdownList}>
          {options.map((option: string) => (
            <li
              key={option}
              className={`${css.option} ${value === option ? css.activeOption : ""}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Главная страница
export const TeachersPage = () => {
  // Состояния для хранения выбранных значений
  const [language, setLanguage] = useState("French");
  const [level, setLevel] = useState("A1 Beginner");
  const [price, setPrice] = useState("30 $");

  return (
    <div className={css.filterGroup}>
      <CustomSelect
        label="Languages"
        options={['French', 'English', 'Ukrainian', 'German', 'Polish']}
        value={language}
        onChange={setLanguage}
      />

      <CustomSelect
        label="Level of knowledge"
        options={['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper-Intermediate']}
        value={level}
        onChange={setLevel}
      />

      <CustomSelect
        label="Price"
        options={['10 $', '20$', '30 $', '40$']}
        value={price}
        onChange={setPrice}
      />
    </div>
  );
};