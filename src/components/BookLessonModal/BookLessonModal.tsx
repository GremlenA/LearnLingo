import React, { useEffect, useState } from 'react';
  import { useForm, type SubmitHandler } from "react-hook-form";
  import toast from 'react-hot-toast';
  import css from './BookLessonModal.module.css';
  import closeImg from "../../assets/images/close.svg";

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

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeModal();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeModal]);

    const { register, handleSubmit, formState: { errors } } = useForm<IForm>();

    const onSubmit: SubmitHandler<IForm> = async (data) => {
      const bookingData = {
        ...data,
        reason: selectedReason,
        teacherId,
      };
      console.log("Данные для бронирования:", bookingData);

      closeModal();
      toast.success('Lesson booked successfully!');
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
            Our experienced tutor will assess your current language level, discuss your learning goals, and tailor the lesson to your specific needs.
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
            <input
              className={css.inputField}
              type="text"
              placeholder="Full Name"
              {...register('fullName', { required: true })}
            />
            <input
              className={css.inputField}
              type="email"
              placeholder="Email"
              {...register('email', { required: true })}
            />
            <input
              className={css.inputField}
              type="tel"
              placeholder="Phone number"
              {...register('phone', { required: true })}
            />

            <button type="submit" className={css.submitBtn}>Book</button>
          </form>
        </div>
      </div>
    );
  };
