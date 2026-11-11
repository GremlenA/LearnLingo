export interface StudentStats {
  studentId: string;
  lessonsTogether: number;
  lastLessonDate: string | null;
}

export interface StudentCardData {
  id: string; 
  fullName: string;
  avatarUrl: string | null;
  language: string;
  level: string;
  lessonsTogether: number;
}