import css from './Profile.module.css';
import { UserInfoCard } from '../../components/Profile/UserInfoCard/UserInfoCard';

export const ProfilePage = () => {
return(
   <div className={css.pageWrapper}>
     <div className={css.container}>
        <section className={css.topRow}>
          <UserInfoCard/>
        </section>
     </div>
   </div>
 );
};