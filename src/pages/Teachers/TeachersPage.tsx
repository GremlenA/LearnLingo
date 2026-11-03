import { useState, useRef, useEffect } from "react";
// ИСПРАВЛЕНИЕ 1: Импортируем onSnapshot и query, where для правильного запроса
import { collection, onSnapshot, query, where } from "firebase/firestore";
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
    // ИСПРАВЛЕНИЕ 2: Запрашиваем из коллекции users, где role == teacher
    const q = query(collection(db, "users"), where("role", "==", "teacher"));

    // ИСПРАВЛЕНИЕ 3: Используем onSnapshot для обновлений в реальном времени
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const teacherArray: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // ИСПРАВЛЕНИЕ 4: Адаптируем ключи из формы настроек под формат карточки
        teacherArray.push({ 
          id: doc.id,
          // Если данные пришли из старой коллекции, используем их, иначе берем новые из настроек
          name: data.firstName || data.name || "Unknown",
          surname: data.lastName || data.surname || "",
          languages: data.language ? [data.language] : (data.languages || []), // Формируем массив
          spokenLanguages: data.spokenLanguages || [], // Передаем новые языки
          levels: data.specializationLevel ? [data.specializationLevel] : (data.levels || []),
          price_per_hour: data.hourlyRate || data.price_per_hour || 0,
          
          // Стандартные/старые поля
          avatar_url: data.photoURL || data.avatar_url || "",
          rating: data.rating || 0,
          lessons_done: data.lessons_done || 0,
          reviews: data.reviews || [],
          lesson_info: data.lesson_info || "Ready to help you achieve your goals!",
          conditions: data.conditions || [],
          experience: data.experience || "Experienced teacher.",
          ...data 
        });
      });
      setTeachers(teacherArray);
    }, (error) => {
      console.error("Ошибка загрузки:", error);
    });

    // Отписываемся при размонтировании
    return () => unsubscribe();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const isLanguageMatch = language === "" ? true : 
      (teacher.languages || []).some((lang: string) => 
        lang.toLowerCase().includes(language.toLowerCase().trim())
      );

    const isLevelMatch = level === "" ? true : 
      (teacher.levels || []).some((lvl: string) => {
        const safeLvl = lvl.toLowerCase().replace('#', '').trim();
        const safeFilter = level.toLowerCase().trim();
        return safeLvl.includes(safeFilter) || safeFilter.includes(safeLvl);
      });

    const isPriceMatch = price === "" ? true : 
      Number(teacher.price_per_hour) <= Number(price.replace(/\D/g, ''));

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
          options={['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper-Intermediate', 'C1 Advanced', 'C2 Proficient']}
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
        
        {paginatedTeachers.length === 0 && (
          <p className={css.noResults}>
            No teachers found for your filters. Try changing the criteria.
          </p>
        )}

        {paginatedTeachers.map((teacher) => (
          <TeacherCard 
            key={teacher.id} 
            {...teacher} 
            selectedLevel={level}
          />
        ))}

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