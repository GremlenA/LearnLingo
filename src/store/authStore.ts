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
  isLoading: boolean;
  setUser: (user: User | null) => void;
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
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userRole: null,
  userData: null, 
  isLoading: true,
  
  setUser: (user) => set({ user }),

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
    
    // 1. Формируем данные для базовой коллекции users
    const userDataToSave = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      role: role,
      createdAt: new Date().toISOString(),
      favorites: [],
      ...extraData 
    };

    // Сохраняем в коллекцию users
    await setDoc(doc(db, 'users', user.uid), userDataToSave);

    // 2. ЕСЛИ ЭТО УЧИТЕЛЬ — создаем карточку в коллекции teachers под фильтры
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

      // Сохраняем в коллекцию teachers
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
       };
       await setDoc(userDocRef, dataToSave);
       set({ user, userRole: roleForNewUser, userData: dataToSave });
    } else {
       const data = userDoc.data();
       set({ user, userRole: data.role, userData: data });
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
        set({ user: null, userRole: null, userData: null });
      }
      set({ isLoading: false }); 
    });
  },
   addToFavorites: async (teacherId: string) => {
    const user = get().user;
    if (!user) return;

    // обновить Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      favorites: arrayUnion(teacherId) // добавит, если нет
    });

    // обновить локальный стейт
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

    // обновить Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      favorites: arrayRemove(teacherId) // удалит
    });

    // обновить локальный стейт
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