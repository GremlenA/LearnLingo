import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from 'react-hot-toast';
import css from './BookLessonModal.module.css';
import closeImg from "../../assets/images/close.svg";
import { useAuthStore } from '../../store/authStore';
import { doc, getDoc, setDoc, increment, collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/getFirestore';

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
  
  // Состояния для расписания
  const [availability, setAvailability] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const { user, userRole } = useAuthStore();

  // Проверка роли и загрузка расписания преподавателя
  useEffect(() => {
    if (userRole === 'teacher') {
      toast.error('Teachers cannot book lessons');
      closeModal();
      return;
    }

    if (user?.uid === teacherId) {
      toast.error("You can't book a lesson with yourself!");
      closeModal();
      return;
    }

    // Загружаем расписание учителя из базы
    const fetchTeacherAvailability = async () => {
      try {
        const teacherRef = doc(db, 'users', teacherId);
        const teacherSnap = await getDoc(teacherRef);
        if (teacherSnap.exists()) {
          const data = teacherSnap.data();
          setAvailability(data.availability || null);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchTeacherAvailability();
  }, [userRole, user, teacherId, closeModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  const { register, handleSubmit, formState: { errors } } = useForm<IForm>();

  // Проверяем, есть ли у преподавателя хотя бы один доступный слот
  const hasAvailableSlots = availability && Object.values(availability).some((times: any) => times.length > 0);

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    // Валидация выбора времени, если расписание существует
    if (hasAvailableSlots && (!selectedDay || !selectedTime)) {
      toast.error("Please select a date and time for your lesson.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user?.uid) throw new Error("User not found");

      // 1. Создаем запись о самом уроке в коллекции lessons
      const lessonRef = collection(db, 'lessons');
      await addDoc(lessonRef, {
        teacherId,
        studentId: user.uid,
        studentName: data.fullName,
        studentEmail: data.email,
        studentPhone: data.phone,
        reason: selectedReason,
        day: selectedDay || 'Not specified',
        time: selectedTime || 'Not specified',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      });

      // 2. ОБНОВЛЯЕМ СВЯЗЬ: Добавляем студента в список "My Students" к преподавателю
      const relationshipId = `${teacherId}_${user.uid}`;
      const relationshipRef = doc(db, 'teacher_students', relationshipId);
      
      await setDoc(relationshipRef, {
        teacherId: teacherId,
        studentId: user.uid,
        lessonsTogether: increment(1),
        lastLessonDate: new Date().toISOString(),
        
        // НОВОЕ: Сохраняем имя и причину из формы как запасной вариант (fallback)
        cachedName: data.fullName,
        cachedReason: selectedReason
      }, { merge: true }); 

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
          Our experienced tutor will assess your current language level, discuss your learning goals, and tailor the lesson to your specific needs.
        </p>

        <div className={css.teacherInfo}>
          <img src={teacherAvatarUrl} alt={teacherName} className={css.teacherAvatar} />
          <div>
            <p className={css.teacherLabel}>Your teacher</p>
            <p className={css.teacherName}>{teacherName}</p>
          </div>
        </div>

        <h3 className={css.reasonTitle}>What is your main reason for learning?</h3>
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

        {/* Выбор времени урока */}
        {hasAvailableSlots && (
          <>
            <h3 className={css.reasonTitle} style={{ marginTop: '20px' }}>Select date and time</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              
              {/* Селект Дня */}
              <select 
                className={css.inputField} 
                value={selectedDay} 
                onChange={(e) => {
                  setSelectedDay(e.target.value);
                  setSelectedTime(''); // Сбрасываем время при смене дня
                }}
              >
                <option value="">Select day</option>
                {Object.entries(availability).map(([day, times]: any) => (
                  times.length > 0 && (
                    <option key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </option>
                  )
                ))}
              </select>

              {/* Селект Времени */}
              <select 
                className={css.inputField} 
                value={selectedTime} 
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={!selectedDay}
              >
                <option value="">Select time</option>
                {selectedDay && availability[selectedDay]?.map((time: string) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              className={`${css.inputField} ${errors.fullName ? css.inputError : ''}`}
              type="text"
              placeholder="Full Name"
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
            />
            {errors.fullName && <span className={css.errorMessage}>{errors.fullName.message}</span>}
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
            {errors.email && <span className={css.errorMessage}>{errors.email.message}</span>}
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
                minLength: { value: 10, message: 'Phone number must be at least 10 digits' }
              })}
            />
            {errors.phone && <span className={css.errorMessage}>{errors.phone.message}</span>}
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