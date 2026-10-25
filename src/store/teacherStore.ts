import { create } from 'zustand';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/getFirestore'; 

interface TeacherState {
  upcomingLessons: any[];
  myStudents: any[];
  reviews: any[];
  isLoading: boolean;
  fetchTeacherData: (teacherId: string) => Promise<void>;
}

export const useTeacherStore = create<TeacherState>((set) => ({
  upcomingLessons: [],
  myStudents: [],
  reviews: [],
  isLoading: false,

  fetchTeacherData: async (teacherId: string) => {
    set({ isLoading: true });
    try {
      // 1. Запрашиваем будущие уроки преподавателя
      const lessonsQuery = query(collection(db, 'lessons'), where('teacherId', '==', teacherId));
      const lessonsSnapshot = await getDocs(lessonsQuery);
      const lessons = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 2. Запрашиваем студентов (например, тех, кто привязан к этому учителю)
      const studentsQuery = query(collection(db, 'users'), where('assignedTeacherId', '==', teacherId));
      const studentsSnapshot = await getDocs(studentsQuery);
      const students = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 3. Сохраняем реальные данные в стейт
      set({ 
        upcomingLessons: lessons, 
        myStudents: students,
        // Запрос для отзывов делается аналогично...
        isLoading: false 
      });
    } catch (error) {
      console.error("Ошибка при загрузке данных преподавателя:", error);
      set({ isLoading: false });
    }
  }
}));