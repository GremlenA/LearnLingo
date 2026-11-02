import React from 'react';
import { useFormContext } from "react-hook-form";
import css from "./TeachingPreferencesFields.module.css";

export const TeachingPreferencesFields = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={css.preferencesCard}>
      <h2 className={css.title}>Teaching Preferences</h2>
      
      <div className={css.fieldsGrid}>
        
        {/* Выпадающий список Language */}
        <div className={css.inputGroup}>
          <label>Language</label>
          <select className={css.select} {...register("language")}>
            <option value="">Select language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
          {errors.language && <span className={css.error}>{errors.language.message as string}</span>}
        </div>

        {/* Выпадающий список Specialization level */}
        <div className={css.inputGroup}>
          <label>Specialization level</label>
          <select className={css.select} {...register("specializationLevel")}>
            <option value="">Select level</option>
            <option value="A1 Beginner">A1 Beginner</option>
            <option value="A2 Elementary">A2 Elementary</option>
            <option value="B1 Intermediate">B1 Intermediate</option>
            <option value="B2 Upper-Intermediate">B2 Upper-Intermediate</option>
            <option value="C1 Advanced">C1 Advanced</option>
            <option value="C2 Proficient">C2 Proficient</option>
          </select>
          {errors.specializationLevel && <span className={css.error}>{errors.specializationLevel.message as string}</span>}
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

        {/* Поле ввода Hourly rate ($) */}
        <div className={css.inputGroup}>
          <label>Hourly rate ($)</label>
          <input 
            type="number" 
            className={css.input} 
            placeholder="30"
            {...register("hourlyRate")} 
          />
          {errors.hourlyRate && <span className={css.error}>{errors.hourlyRate.message as string}</span>}
        </div>

      </div>
    </div>
  );
};