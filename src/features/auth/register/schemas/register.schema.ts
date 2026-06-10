import { z } from "zod";

export const registerSchema = z.object({
  first_name: z.string().min(3, "First name must be at least 3 characters"),
  last_name: z.string().min(3, "Last name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password at least 8 characters"),
  country_id: z.string().min(1, "Please select a country"),
  mobileno: z
    .string()
    .trim()
    .refine((val) => /^\d{10,12}$/.test(val), {
      message: "Enter a valid mobile number (8–12 digits)",
    }),

  partnercode: z
    .string()
    .trim()
    .refine((val) => val === "" || /^\d+$/.test(val), {
      message: "Partner code must contain only numbers",
    })
    .optional(),

  inputchecked: z.boolean().refine((val) => val === true, {
    message: "Please accept the terms",
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
