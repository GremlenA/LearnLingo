import Header from "../../components/Header/Header";
import { Link, NavLink } from 'react-router-dom';
import css from "./Home.module.css"
export const HomePage = () => {
  return (
    <section className={css.homesection}>
    {/* 1. Верхний блок */}
      <div className={css.topContent}>

        <div className={css.textCard}>

            <h1 className={css.h1}>
              Unlock your potential with the best <span className={css.spanLang}>language</span> tutors
            </h1>

            <p className={css.p}>
              Embark on an Exciting Language Journey with Expert Language Tutors: Elevate your language proficiency 
              to new heights by connecting with highly qualified and experienced tutors.
            </p>

            <Link className={css.getStarted} to="/teachers">Get started</Link>

        </div>

        <div className={css.imageCard}>
          <img className={css.cap} alt="cap" src="./cap.svg"/>
          <img className={css.apple} alt="apple" src="./apple.svg"/>
          <img className={css.people} alt="dpeople" src="./people.svg"/>
         </div>
      </div>
         {/* 2. Нижний блок */}
        <ul className={css.statsList}>
  <li className={css.statsItem}>
    <span className={css.statsNumber}>32,000 +</span>
    <p className={css.statsText}>Experienced tutors</p>
  </li>
  <li className={css.statsItem}>
    <span className={css.statsNumber}>300,000 +</span>
    <p className={css.statsText}>5-star tutor reviews</p>
  </li>
  <li className={css.statsItem}>
    <span className={css.statsNumber}>120 +</span>
    <p className={css.statsText}>Subjects taught</p>
  </li>
  <li className={css.statsItem}>
    <span className={css.statsNumber}>200 +</span>
    <p className={css.statsText}>Tutor nationalities</p>
  </li>
</ul>

    </section>
  );

};