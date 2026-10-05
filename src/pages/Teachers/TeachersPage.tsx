import css from "./Teachers.module.css"

export const TeachersPage = () => {
  return (
    <div className={css.filterGroup}>
      {/* Первый блок: Языки */}
      <div className={css.filterItem}>
        <label htmlFor="language-select" className={css.label}>
          Languages
        </label>
        <select id="language-select" className={css.navBar} defaultValue="French">
          <option value='French'>French</option>
          <option value='English'>English</option>
          <option value='Ukrainian'>Ukrainian</option>
          <option value='German'>German</option>
          <option value='Polish'>Polish</option>
        </select>
      </div>

      {/* Второй блок: Уровень */}
      <div className={css.filterItem}>
        <label htmlFor="Level-select" className={css.label}>
          Level of knowledge
        </label>
        <select id="Level-select" className={css.navBar} defaultValue="A1 Beginner">
          <option value='A1 Beginner'>A1 Beginner</option>
          <option value='A2 Elementary'>A2 Elementary</option>
          <option value='B1 Intermediate'>B1 Intermediate</option>
          <option value='B2 Upper-Intermediate'>B2 Upper-Intermediate</option>
        </select>
      </div>

      {/* Третий блок: Цена */}
      <div className={css.filterItem}>
        <label htmlFor="price-select" className={css.label}>
          Price
        </label>
        <select id="price-select" className={css.navBar} defaultValue="30">
          <option value='10'>10 $</option>
          <option value='20'>20 $</option>
          <option value='30'>30 $</option>
          <option value='40'>40 $</option>
        </select>
      </div>
    </div>
  );
};