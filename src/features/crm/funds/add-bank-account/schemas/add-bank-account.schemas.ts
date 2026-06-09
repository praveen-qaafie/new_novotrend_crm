import { z } from "zod";

export const addBankSchema = z.object({
  bankname: z.string().min(2, "Bank name is required"),

  accname: z.string().min(2, "Bank holder name is required"),

  accno: z
    .string()
    .min(8, "Account number must be at least 8 digits")
    .max(20, "Account number is too long")
    .regex(/^\d+$/, "Only numbers are allowed"),

  ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),

  iban_number: z.string().min(10, "IBAN number is required"),

  bankaddress: z.string().min(5, "Bank address is required"),
});

export type AddBankFormData = z.infer<typeof addBankSchema>;
