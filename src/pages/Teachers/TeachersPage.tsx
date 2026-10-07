import { useState, useRef, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/getFirestore";
import css from "./Teachers.module.css";
import { TeacherCard } from "../../components/TeacherCard/TeacherCard";

const CustomSelect = ({ label, options, value, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

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
      
      <button
        type="button"
        className={`${css.selectButton} ${isOpen ? css.selectButtonOpen : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value === "" ? " " : value}
      </button>

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

export const TeachersPage = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    setVisibleCount(10);
  }, [language, level, price]);

  useEffect(() => {
    const getTeachersData = async () => {
      try {
        const teachersRef = collection(db, "teachers");
        const querySnapshot = await getDocs(teachersRef);
        const tacherArray: any[] = [];

        querySnapshot.forEach((doc) => {
          tacherArray.push({ id: doc.id, ...doc.data() });
        });
        setTeachers(tacherArray);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      }
    };
    getTeachersData();
  }, []);

  // Логика фильтрации
  const filteredTeachers = teachers.filter((teacher) => {
    const isLanguageMatch = language === "" ? true : teacher.languages.includes(language);
    const isLevelMatch = level === "" ? true : teacher.levels.includes(level);
    const isPriceMatch = price === "" ? true : `${teacher.price_per_hour} $` === price;

    return isLanguageMatch && isLevelMatch && isPriceMatch;
  });

  const paginatedTeachers = filteredTeachers.slice(0, visibleCount);

  return (
    <div className={css.pageContainer}>
      
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

        <button 
          className={css.resetButton}
          onClick={() => {
            setLanguage("");
            setLevel("");
            setPrice("");
          }}
        >
          Reset filters
        </button>
      </div>

      <div className={css.cardsList}>
        
        {/* Сообщение при пустом результате фильтрации */}
        {paginatedTeachers.length === 0 && (
          <p className={css.noResults}>
            No teachers found for your filters. Try changing the criteria.
          </p>
        )}

        {/* Вывод карточек */}
        {paginatedTeachers.map((teacher) => (
          <TeacherCard 
            key={teacher.id} 
            {...teacher} 
          />
        ))}

        {/* Кнопка загрузки дополнительных карточек */}
        {visibleCount < filteredTeachers.length && (
          <button 
            className={css.loadMoreBtn} 
            onClick={() => setVisibleCount((prev) => prev + 10)}
          >
            Load more
          </button>
        )}
      </div>

    </div>
  );
};