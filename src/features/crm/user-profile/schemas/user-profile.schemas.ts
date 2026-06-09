import { z } from "zod";

// export const ekycSchema = z.object({
//   doc_type: z.string().min(1, "Please select POI document type"),
//   doc_number: z.string().optional(),
//   doc_type2: z.string().min(1, "Please select POA document type"),
//   doc_number2: z.string().optional(),
// });

// export type EkycFormData = z.infer<typeof ekycSchema>;

export const kycSchema = z.object({
  doc_type: z.string().min(1, "Please select a POI document type"),
  doc_type2: z.string().min(1, "Please select a POA document type"),
});
export type KycFormData = z.infer<typeof kycSchema>;

// user profile schemas

// export const profileSchema = z.object({
//   first_name: z.string().min(1, "First name is required"),
//   last_name: z.string().min(1, "Last name is required"),
//   dob: z.string().min(1, "Date of birth is required"),
//   bio: z.string().optional(),
// });

// export type ProfileFormData = z.infer<typeof profileSchema>;

export const profileSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name too long")
    .regex(/^[a-zA-Z\s]+$/, "Only alphabets allowed"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name too long")
    .regex(/^[a-zA-Z\s]+$/, "Only alphabets allowed"),
  phone: z
    .string()
    .min(10, "Phone must be 10 digits")
    .max(10, "Phone must be 10 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),
  bio: z.string().max(300, "Bio must be under 300 characters").optional(),
  dob: z.string().min(1, "Date of birth is required"),
  country: z.string().optional(),
});
export type ProfileFormData = z.infer<typeof profileSchema>;

// update-password

export const updatePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Please enter your current password"),

    new_password: z.string().min(8, "Password must be at least 8 characters"),

    confirm_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
