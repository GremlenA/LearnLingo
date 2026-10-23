import css from "./ProgressTab.module.css";
import { useAuthStore } from "../../store/authStore";

export const ProgressTab = () => {
  const { userData } = useAuthStore();

  const stats = userData?.stats || {
    completed_lessons_total: 0,
    completed_lessons_this_month: 0,
    hours_learned_total: 0,
    monthly_hours_goal: 0,
    weekly_streak: 0,
    lessons_balance: 0,
  };

  return (
    <div className={css.gridContainer}>
      {/* 1. Completed Lessons */}
      <div className={css.statCard}>
        <p className={css.cardTitle}>Completed Lessons</p>
        <h3 className={css.cardValue}>{stats.completed_lessons_total}</h3>
        <p className={css.cardSubtextSuccess}>
          +{stats.completed_lessons_this_month} this month
        </p>
      </div>

      {/* 2. Hours Learned */}
      <div className={css.statCard}>
        <p className={css.cardTitle}>Hours Learned</p>
        <h3 className={css.cardValue}>{stats.hours_learned_total} h</h3>
        <p className={css.cardSubtext}>
          Goal: {stats.monthly_hours_goal}h / month
        </p>
      </div>

      {/* 3. Weekly Streak */}
      <div className={css.statCard}>
        <p className={css.cardTitle}>Weekly Streak</p>
        <h3 className={css.cardValue}>{stats.weekly_streak} weeks 🔥</h3>
        <p className={css.cardSubtext}>Without missing a scheduled class</p>
      </div>

      {/* 4. Prepaid Balance */}
      <div className={`${css.statCard} ${css.balanceCard}`}>
        <div>
          <p className={css.cardTitle}>Prepaid Balance</p>
          <h3 className={css.cardValue}>{stats.lessons_balance} lessons</h3>
          <p className={css.cardSubtext}>Available to book</p>
        </div>
        <button className={css.topUpBtn}>+ Top up</button>
      </div>
    </div>
  );
};
