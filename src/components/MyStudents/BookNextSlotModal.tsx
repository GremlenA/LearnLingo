import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { collection, addDoc, doc, setDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase/getFirestore'; 
import { useAuthStore } from '../../store/authStore'; 
import type { StudentCardData } from '../../types';
import css from './BookNextSlotModal.module.css'; 

interface Props {
  student: StudentCardData;
  closeModal: () => void;
}

export const BookNextSlotModal: React.FC<Props> = ({ student, closeModal }) => {
  const { user, userData } = useAuthStore();
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Добавляем стейт для отслеживания фокуса на поле времени
  const [isTimeFocused, setIsTimeFocused] = useState(false);

  const availability = userData?.availability || {};
  const hasAvailableSlots = Object.values(availability).some((times: any) => times.length > 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  const handleBook = async () => {
    if (!selectedDay || !selectedTime) {
      toast.error("Please select day and time");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!user?.uid) throw new Error("User not authenticated");

      await addDoc(collection(db, 'lessons'), {
        teacherId: user.uid,
        studentId: student.id,
        studentName: student.fullName,
        day: selectedDay,
        time: selectedTime,
        status: 'scheduled',
        bookedBy: 'teacher', 
        createdAt: new Date().toISOString(),
      });

      const relationshipRef = doc(db, 'teacher_students', `${user.uid}_${student.id}`);
      await setDoc(relationshipRef, {
        lessonsTogether: increment(1),
        lastLessonDate: new Date().toISOString(),
      }, { merge: true });

      toast.success(`Lesson booked for ${student.fullName}!`);
      closeModal();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={css.backdrop} onClick={closeModal}>
      <div className={css.popUp} onClick={(e) => e.stopPropagation()}>
        
        <h2 className={css.title}>Book lesson for {student.fullName}</h2>

        {!hasAvailableSlots ? (
          <p className={css.message}>You haven't set your availability in settings yet.</p>
        ) : (
          <>
            <select 
              className={css.select}
              value={selectedDay} 
              onChange={(e) => {
                setSelectedDay(e.target.value);
                setSelectedTime('');
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

            {/* ИСПРАВЛЕНО: Динамический тип поля ввода */}
            <input 
              type={selectedTime || isTimeFocused ? "time" : "text"}
              className={css.select}
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={!selectedDay}
              onFocus={() => setIsTimeFocused(true)}
              onBlur={() => setIsTimeFocused(false)}
              placeholder="Enter time (e.g. 13:45)"
            />
          </>
        )}

        <button 
          className={css.btn} 
          onClick={handleBook} 
          disabled={isSubmitting || !hasAvailableSlots}
        >
          {isSubmitting ? 'Booking...' : 'Confirm booking'}
        </button>
        
        <button className={css.cancelBtn} onClick={closeModal}>
          Cancel
        </button>

      </div>
    </div>
  );
};