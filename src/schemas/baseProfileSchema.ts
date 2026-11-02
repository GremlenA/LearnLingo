import * as yup from "yup";

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
    .required("Phone is required")
    .matches(
      /^\+?[0-9\s]{10,20}$/,
      "Invalid phone format. Only digits, spaces, and a leading '+' are allowed."
    )
});