import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Please enter your password"),
});

export type LoginFormData = z.infer<typeof loginSchema>;