import * as yup from "yup";

// 1. Базовая схема (Имя, Фамилия и Email обязательны, телефон - нет)
export const baseProfileSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "Name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      "Invalid email address"
    ),
  phone: yup
    .string()
    .notRequired() 
    .matches(
      /^\+?[0-9\s]{10,20}$/,
      { 
        message: "Invalid phone format. Only digits, spaces, and a leading '+' are allowed.", 
        excludeEmptyString: true 
      }
    )
});

// 2. Схема для ученика (все настройки обучения опциональны)
export const studentProfileSchema = baseProfileSchema.shape({
  language: yup.string().notRequired(),
  currentLevel: yup.string().notRequired(),
  mainGoal: yup.string().notRequired(),
});

// 3. Схема для преподавателя
export const teacherProfileSchema = baseProfileSchema.shape({
  language: yup.string().notRequired(),
  specializationLevel: yup.string().notRequired(),
  mainGoal: yup.string().notRequired(),
  hourlyRate: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired()
    .positive("Rate must be positive")
    .integer("Rate must be an integer"),
    
  // --- НОВОЕ ПОЛЕ: Дополнительные языки ---
  spokenLanguages: yup.array().of(yup.string()).default([]),

  // Расписание 
  availability: yup
    .object()
    .shape({
      monday: yup.array().of(yup.string()).default([]),
      tuesday: yup.array().of(yup.string()).default([]),
      wednesday: yup.array().of(yup.string()).default([]),
      thursday: yup.array().of(yup.string()).default([]),
      friday: yup.array().of(yup.string()).default([]),
      saturday: yup.array().of(yup.string()).default([]),
      sunday: yup.array().of(yup.string()).default([]),
    })
    .default(() => ({
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    })),
});