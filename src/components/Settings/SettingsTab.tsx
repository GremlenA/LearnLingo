import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/getFirestore";
import { useAuthStore } from "../../store/authStore";
import {
  teacherProfileSchema,
  studentProfileSchema,
} from "../../schemas/profileSchemas";
import { PersonalInfoFields } from "./PersonalInfoFields/PersonalInfoFields";
import { TeachingPreferencesFields } from "./TeachingPreferencesFields/TeachingPreferencesFields";
import { LearningPreferencesFields } from "./LearningPreferencesFields/LearningPreferencesFields";
import css from "./SettingsTab.module.css"; 

export const SettingsTab = () => {
  const { userRole, user, userData, updateUserData } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const currentSchema =
    userRole === "teacher" ? teacherProfileSchema : studentProfileSchema;

  const defaultFullName = userData?.displayName || user?.displayName || "";
  const nameParts = defaultFullName.trim().split(" ");
  const fallbackFirstName = nameParts[0] || "";
  const fallbackLastName = nameParts.slice(1).join(" ") || "";

  const defaultAvailability = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  const methods = useForm({
    resolver: yupResolver(currentSchema as any),
    mode: "onBlur",
    defaultValues: {
      firstName: userData?.firstName || fallbackFirstName,
      lastName: userData?.lastName || fallbackLastName,
      email: userData?.email || user?.email || "",
      phone: userData?.phone || "",
      language: userData?.language || "",
      specializationLevel: userData?.specializationLevel || "",
      currentLevel: userData?.currentLevel || "",
      mainGoal: userData?.mainGoal || "",
      hourlyRate: userData?.hourlyRate || "",
      age: userData?.age || "",
      country: userData?.country || "",
      nativeLanguage: userData?.nativeLanguage || "",
      availability: userData?.availability || defaultAvailability,
      spokenLanguages: userData?.spokenLanguages || [],
      // Если ты добавил shortBio в TeachingPreferences, здесь мы его тоже оставляем для подгрузки старых данных (если они есть)
      shortBio: userData?.shortBio || "", 
    },
  });

  const onSubmit = async (data: any) => {
    if (!user?.uid) return;

    setIsSaving(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, data);
      updateUserData(data);
      alert("Profile successfully updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={css.formContainer}
      >
        <PersonalInfoFields />

        {/* Если роль teacher — показываем его поля. Во всех остальных случаях — поля студента */}
        {userRole === "teacher" ? (
          <TeachingPreferencesFields />
        ) : (
          <LearningPreferencesFields />
        )}

        <div className={css.extraFieldsContainer}>
          <label>Age</label>
          <input 
            type="number" 
            className={css.inputField} 
            {...methods.register("age")} 
          />

          <label>Country</label>
          <input 
            type="text" 
            className={css.inputField} 
            {...methods.register("country")} 
          />

          <label>Native Language</label>
          <input 
            type="text" 
            className={css.inputField} 
            {...methods.register("nativeLanguage")} 
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={`${css.saveButton} ${isSaving ? css.saveButtonSaving : css.saveButtonActive}`}
        >
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </FormProvider>
  );
};