import React from 'react';
import { useFormContext } from "react-hook-form";
import css from "./LearningPreferencesFields.module.css";

export const LearningPreferencesFields = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={css.preferencesCard}>
      <h2 className={css.title}>Learning Preferences</h2>
      
      <div className={css.fieldsGrid}>
        
        {/* Выпадающий список Language */}
        <div className={css.inputGroup}>
          <label>Language I want to learn</label>
          <select className={css.select} {...register("language")}>
            <option value="">Select language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
          {errors.language && <span className={css.error}>{errors.language.message as string}</span>}
        </div>

        {/* Выпадающий список Current level */}
        <div className={css.inputGroup}>
          <label>Current level</label>
          <select className={css.select} {...register("currentLevel")}>
            <option value="">Select level</option>
            <option value="A1 Beginner">A1 Beginner</option>
            <option value="A2 Elementary">A2 Elementary</option>
            <option value="B1 Intermediate">B1 Intermediate</option>
            <option value="B2 Upper-Intermediate">B2 Upper-Intermediate</option>
            <option value="C1 Advanced">C1 Advanced</option>
            <option value="C2 Proficient">C2 Proficient</option>
          </select>
          {errors.currentLevel && <span className={css.error}>{errors.currentLevel.message as string}</span>}
        </div>

        {/* Выпадающий список Main goal */}
        <div className={css.inputGroup}>
          <label>Main goal</label>
          <select className={css.select} {...register("mainGoal")}>
            <option value="">Select goal</option>
            <option value="Career and business">Career and business</option>
            <option value="Lesson for kids">Lesson for kids</option>
            <option value="Living abroad">Living abroad</option>
            <option value="Exams and coursework">Exams and coursework</option>
            <option value="Culture, travel or hobby">Culture, travel or hobby</option>
          </select>
          {errors.mainGoal && <span className={css.error}>{errors.mainGoal.message as string}</span>}
        </div>

      </div>
    </div>
  );
};