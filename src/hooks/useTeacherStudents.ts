import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot, documentId } from 'firebase/firestore';
import { db } from '../firebase/getFirestore';
import type { StudentStats, StudentCardData } from '../types/index'; 

// Расширяем локальный тип для статистики, чтобы принять кэшированные данные
interface LocalStats extends StudentStats {
  cachedName?: string;
  cachedReason?: string;
}

export const useTeacherStudents = (teacherId: string | undefined) => {
  const [students, setStudents] = useState<StudentCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId) {
      setStudents([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const relationshipsRef = collection(db, 'teacher_students');
    const q = query(relationshipsRef, where('teacherId', '==', teacherId));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      try {
        if (querySnapshot.empty) {
          setStudents([]);
          setLoading(false);
          return;
        }

        const statsList: LocalStats[] = [];
        const studentIds: string[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          statsList.push({
            studentId: data.studentId,
            lessonsTogether: data.lessonsTogether || 0,
            lastLessonDate: data.lastLessonDate || null,
            // Достаем кэшированные данные из модалки бронирования
            cachedName: data.cachedName,
            cachedReason: data.cachedReason
          });
          studentIds.push(data.studentId);
        });

        const usersRef = collection(db, 'users');
        const profilesMap = new Map<string, any>(); 

        const chunkArray = (arr: string[], size: number) =>
          Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
            arr.slice(i * size, i * size + size)
          );

        const idChunks = chunkArray(studentIds, 10);

        for (const chunk of idChunks) {
          const userQuery = query(usersRef, where(documentId(), 'in', chunk));
          const userSnapshot = await getDocs(userQuery);
          
          userSnapshot.forEach((userDoc) => {
            profilesMap.set(userDoc.id, userDoc.data());
          });
        }

        const formattedStudents: StudentCardData[] = statsList.map((stats) => {
          const profile = profilesMap.get(stats.studentId);

          const firstName = profile?.firstName || '';
          const lastName = profile?.lastName || '';
          const profileName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : '';

          // ЛОГИКА ИМЕНИ: Профиль -> Форма бронирования -> Дефолт
          const fullName = profileName || stats.cachedName || profile?.displayName || 'Unknown Student';

          return {
            id: stats.studentId,
            fullName: fullName,
            avatarUrl: profile?.photoURL || null,
            
            // ЛОГИКА ОПИСАНИЯ: Если в профиле нет языка, показываем цель (Reason) из формы
            language: profile?.language || stats.cachedReason || 'Goal not set',
            level: profile?.currentLevel || 'New Student',
            
            lessonsTogether: stats.lessonsTogether,
          };
        });

        setStudents(formattedStudents);
        setError(null);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error("Snapshot error:", err);
      setError("Failed to listen for student updates.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [teacherId]);

  return { students, loading, error };
};