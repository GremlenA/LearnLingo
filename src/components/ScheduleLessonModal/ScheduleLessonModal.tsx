import React, { useState } from 'react';
import css from './ScheduleLessonModal.module.css';
import { useAuthStore } from '../../store/authStore';
import { createMeetLink } from '../../api/googleCalendar';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/getFirestore'; 

interface ScheduleLessonModalProps {
  onClose: () => void;
}

export const ScheduleLessonModal: React.FC<ScheduleLessonModalProps> = ({ onClose }) => {
  const { user, googleAccessToken } = useAuthStore();
  
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1)); 
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  // Оставляем дефолтное значение
  const [selectedTime, setSelectedTime] = useState<string>('18:00'); 
  
  const [selectedStudent, setSelectedStudent] = useState<string>(''); 
  const [manualMeetingUrl, setManualMeetingUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const emptyDaysOffset = (firstDayOfMonth + 6) % 7; 
  
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDaysArray = Array.from({ length: emptyDaysOffset }, (_, i) => i);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !selectedStudent) {
      alert("Please select a date, time, and student.");
      return;
    }

    if (!googleAccessToken && !manualMeetingUrl.trim()) {
      alert("Please provide a meeting link or log in with Google to auto-generate one.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Строка '18:30' легко разбивается на [18, 30]
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const lessonDateTime = new Date(currentMonth);
      lessonDateTime.setDate(selectedDate);
      lessonDateTime.setHours(hours, minutes, 0, 0);

      let finalMeetUrl = manualMeetingUrl.trim();

      if (googleAccessToken) {
        const generatedUrl = await createMeetLink(googleAccessToken, lessonDateTime, 60, selectedStudent);
        if (!generatedUrl) {
          throw new Error("Failed to get Google Meet link.");
        }
        finalMeetUrl = generatedUrl;
      }

      await addDoc(collection(db, 'lessons'), {
        teacherId: user?.uid,
        studentName: selectedStudent,
        subject: "English",
        lessonType: "Regular Lesson",
        startTime: lessonDateTime.toISOString(),
        durationMinutes: 60,
        meetingUrl: finalMeetUrl, 
        createdAt: new Date().toISOString()
      });

      alert("Lesson successfully scheduled!");
      onClose(); 

    } catch (error) {
      console.error("Error scheduling lesson:", error);
      alert("An error occurred while scheduling the lesson.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={css.modalOverlay}>
      <div className={css.modalContainer}>
        <h2 className={css.title}>Schedule lesson</h2>
        
        <div className={css.studentSelectWrapper}>
          <select 
            className={css.studentSelect} 
            value={selectedStudent} 
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
             <option value="" disabled>Select student...</option>
             <option value="Alex Kovalenko">Alex Kovalenko</option>
             <option value="Jane Doe">Jane Doe</option>
          </select>
        </div>

        {!googleAccessToken && (
          <div className={css.manualLinkWrapper}>
            <input 
              type="url"
              className={css.manualLinkInput}
              placeholder="Paste link (Zoom, Meet, Skype)"
              value={manualMeetingUrl}
              onChange={(e) => setManualMeetingUrl(e.target.value)}
            />
            <p className={css.helperText}>
              Add meeting URL manually, since you are not logged in with Google.
            </p>
          </div>
        )}

        <div className={css.monthHeader}>{monthName}</div>

        <div className={css.calendarGrid}>
          {weekDays.map(day => (
            <div key={day} className={css.weekDay}>{day}</div>
          ))}
          {emptyDaysArray.map(step => (
            <div key={`empty-${step}`} className={css.dayCell}></div>
          ))}
          {daysArray.map(day => (
            <button 
              key={day} 
              className={`${css.dayCell} ${selectedDate === day ? css.activeDay : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              {day}
            </button>
          ))}
        </div>

        {/* НОВЫЙ БЛОК: Ручной ввод времени */}
        <div className={css.timeInputWrapper}>
          <label htmlFor="lessonTime" className={css.timeInputLabel}>Start time:</label>
          <input 
            type="time" 
            id="lessonTime"
            className={css.timeInput} 
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          />
        </div>

        <div className={css.actionButtons}>
          <button 
            className={css.confirmBtn} 
            onClick={handleConfirm} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Confirm'}
          </button>
          <button className={css.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};