import { create } from 'zustand';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  FacebookAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/getFirestore';

interface AuthState {
  user: User | null;
  userRole: 'student' | 'teacher' | null;
  userData: any | null; 
  googleAccessToken: string | null; // Добавлено для хранения токена Google API
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setGoogleToken: (token: string | null) => void; // Метод для ручного обновления токена при необходимости
  registerWithEmail: (email: string, pass: string, role: 'student' | 'teacher', name: string, extraData?: any) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: (roleForNewUser?: 'student' | 'teacher') => Promise<void>;
  loginWithFacebook: (roleForNewUser?: 'student' | 'teacher') => Promise<void>;
  checkUserRole: (uid: string) => Promise<void>;
  initAuth: () => void;
  addToFavorites: (teacherId: string) => Promise<void>;
  removeFromFavorites: (teacherId: string) => Promise<void>;
  checkIfFavorite: (teacherId: string) => boolean;
}

const auth = getAuth();

// Инициализируем провайдер и сразу добавляем права на календарь
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');

const facebookProvider = new FacebookAuthProvider();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userRole: null,
  userData: null, 
  googleAccessToken: null, // Инициализация
  isLoading: true,
  
  setUser: (user) => set({ user }),
  setGoogleToken: (token) => set({ googleAccessToken: token }),

  checkUserRole: async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
         const data = userDoc.data();
         set({ userRole: data.role, userData: data }); 
      }
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
    }
  },

  registerWithEmail: async (email, password, role, name, extraData = {}) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName: name });
    
    const userDataToSave = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      role: role,
      createdAt: new Date().toISOString(),
      favorites: [],
      stats: {
        completed_lessons_total: 0,
        completed_lessons_this_month: 0,
        hours_learned_total: 0,
        monthly_hours_goal: 20,
        weekly_streak: 0,
        lessons_balance: 0
      },
      ...extraData 
    };

    await setDoc(doc(db, 'users', user.uid), userDataToSave);

    if (role === 'teacher') {
      const teacherCardData = {
        name: name,
        surname: "", 
        languages: extraData.language ? [extraData.language] : ["English"], 
        levels: extraData.level ? [extraData.level] : ["B2 Upper-Intermediate"], 
        price_per_hour: Number(extraData.price) || 0, 
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FBE9BA&color=121417&size=128&bold=true`,
        rating: 0, 
        reviews: [], 
        lessons_done: 0,
        experience: "New teacher on the platform. Ready to help you achieve your goals!", 
        conditions: ["First lesson is free"] 
      };

      await setDoc(doc(db, 'teachers', user.uid), teacherCardData);
    }
    
    set({ 
      user: { ...user, displayName: name } as User, 
      userRole: role, 
      userData: userDataToSave 
    });
  },

  loginWithEmail: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    set({ user: userCredential.user });
    await get().checkUserRole(userCredential.user.uid);
  },

  loginWithGoogle: async (roleForNewUser = 'student') => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Извлекаем токен доступа к Google API и сохраняем его в стейт
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || null;
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
       const dataToSave = {
         uid: user.uid,
         email: user.email,
         displayName: user.displayName,
         photoURL: user.photoURL,
         role: roleForNewUser,
         createdAt: new Date().toISOString(),
         favorites: [],
         stats: {
           completed_lessons_total: 0,
           completed_lessons_this_month: 0,
           hours_learned_total: 0,
           monthly_hours_goal: 20,
           weekly_streak: 0,
           lessons_balance: 0
         }
       };
       await setDoc(userDocRef, dataToSave);
       set({ user, userRole: roleForNewUser, userData: dataToSave, googleAccessToken: token });
    } else {
       const data = userDoc.data();
       set({ user, userRole: data.role, userData: data, googleAccessToken: token });
    }
  },

  loginWithFacebook: async (roleForNewUser = 'student') => {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
       const dataToSave = {
         uid: user.uid,
         email: user.email,
         displayName: user.displayName,
         photoURL: user.photoURL,
         role: roleForNewUser,
         createdAt: new Date().toISOString(),
         favorites: [],
         stats: {
           completed_lessons_total: 0,
           completed_lessons_this_month: 0,
           hours_learned_total: 0,
           monthly_hours_goal: 20,
           weekly_streak: 0,
           lessons_balance: 0
         }
       };
       await setDoc(userDocRef, dataToSave);
       set({ user, userRole: roleForNewUser, userData: dataToSave });
    } else {
       const data = userDoc.data();
       set({ user, userRole: data.role, userData: data });
    }
  },

  initAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        set({ user });
        await get().checkUserRole(user.uid); 
      } else {
        // Очищаем токен при выходе
        set({ user: null, userRole: null, userData: null, googleAccessToken: null });
      }
      set({ isLoading: false }); 
    });
  },
  
  addToFavorites: async (teacherId: string) => {
    const user = get().user;
    if (!user) return;

    await updateDoc(doc(db, 'users', user.uid), {
      favorites: arrayUnion(teacherId) 
    });

    const currentData = get().userData;
    set({
      userData: {
        ...currentData,
        favorites: [...(currentData.favorites || []), teacherId]
      }
    });
  },

  removeFromFavorites: async (teacherId: string) => {
    const user = get().user;
    if (!user) return;

    await updateDoc(doc(db, 'users', user.uid), {
      favorites: arrayRemove(teacherId) 
    });

    const currentData = get().userData;
    set({
      userData: {
        ...currentData,
        favorites: currentData.favorites.filter((id: string) => id !== teacherId)
      }
    });
  },

  checkIfFavorite: (teacherId: string) => {
    const userData = get().userData;
    return userData?.favorites?.includes(teacherId) || false;
  },
}));