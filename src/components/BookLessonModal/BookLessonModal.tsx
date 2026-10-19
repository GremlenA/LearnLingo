import React, { useEffect, useState } from 'react';
  import { useForm, type SubmitHandler } from "react-hook-form";
  import toast from 'react-hot-toast';
  import css from './BookLessonModal.module.css';
  import closeImg from "../../assets/images/close.svg";
  import { useAuthStore } from '../../store/authStore';

  interface BookLessonProps {
    closeModal: () => void;
    teacherId: string;
    teacherName: string;
    teacherAvatarUrl: string;
  }

  interface IForm {
    reason: string;
    fullName: string;
    email: string;
    phone: string;
  }

  export const BookLessonModal: React.FC<BookLessonProps> = ({
    closeModal,
    teacherId,
    teacherName,
    teacherAvatarUrl
  }) => {
    const [selectedReason, setSelectedReason] = useState<string>('Career and business');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Достаем данные пользователя из стора
    const { user, userRole } = useAuthStore();

    // Проверка роли и что не бронирует у себя
    useEffect(() => {
      // Проверка 1: Учитель не может бронировать уроки
      if (userRole === 'teacher') {
        toast.error('Teachers cannot book lessons');
        closeModal();
        return;
      }

      // Проверка 2: Нельзя бронировать урок у самого себя
      if (user?.uid === teacherId) {
        toast.error("You can't book a lesson with yourself!");
        closeModal();
        return;
      }
    }, [userRole, user, teacherId, closeModal]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeModal();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeModal]);

    const { register, handleSubmit, formState: { errors } } = useForm<IForm>();

    const onSubmit: SubmitHandler<IForm> = async (data) => {
      setIsSubmitting(true);

      try {
        const bookingData = {
          ...data,
          reason: selectedReason,
          teacherId,
          userId: user?.uid,
          createdAt: new Date().toISOString(),
        };

        console.log("Данные для бронирования:", bookingData);

        // Здесь будет сохранение в Firestore
        // await saveBookingToFirestore(bookingData);

        toast.success('Lesson booked successfully!');
        closeModal();
      } catch (error) {
        console.error('Error booking lesson:', error);
        toast.error('Failed to book lesson. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const reasons = [
      "Career and business",
      "Lesson for kids",
      "Living abroad",
      "Exams and coursework",
      "Culture, travel or hobby"
    ];

    return (
      <div className={css.backdrop} onClick={closeModal}>
        <div className={css.popUp} onClick={(e) => e.stopPropagation()}>
          <button type="button" className={css.closeButton} onClick={closeModal}>
            <img src={closeImg} alt="Close" />
          </button>

          <h2 className={css.title}>Book trial lesson</h2>
          <p className={css.description}>
            Our experienced tutor will assess your current language level, discuss your learning goals, and tailor the
  lesson to your specific needs.
          </p>

          <div className={css.teacherInfo}>
            <img src={teacherAvatarUrl} alt={teacherName} className={css.teacherAvatar} />
            <div>
              <p className={css.teacherLabel}>Your teacher</p>
              <p className={css.teacherName}>{teacherName}</p>
            </div>
          </div>

          <h3 className={css.reasonTitle}>What is your main reason for learning ?</h3>

          <div className={css.reasonsList}>
            {reasons.map((reason) => (
              <label key={reason} className={css.radioLabel}>
                <input
                  type="radio"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className={css.radioInput}
                />
                <span className={css.customRadio}></span>
                {reason}
              </label>
            ))}
          </div>

          <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                className={`${css.inputField} ${errors.fullName ? css.inputError : ''}`}
                type="text"
                placeholder="Full Name"
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
              />
              {errors.fullName && (
                <span className={css.errorMessage}>{errors.fullName.message}</span>
              )}
            </div>

            <div>
              <input
                className={`${css.inputField} ${errors.email ? css.inputError : ''}`}
                type="email"
                placeholder="Email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email format'
                  }
                })}
              />
              {errors.email && (
                <span className={css.errorMessage}>{errors.email.message}</span>
              )}
            </div>

            <div>
              <input
                className={`${css.inputField} ${errors.phone ? css.inputError : ''}`}
                type="tel"
                placeholder="Phone number"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                    message: 'Invalid phone format'
                  },
                  minLength: {
                    value: 10,
                    message: 'Phone number must be at least 10 digits'
                  }
                })}
              />
              {errors.phone && (
                <span className={css.errorMessage}>{errors.phone.message}</span>
              )}
            </div>

            <button
              type="submit"
              className={css.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Booking...' : 'Book'}
            </button>
          </form>
        </div>
      </div>
    );
  };