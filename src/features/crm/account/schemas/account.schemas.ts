import { z } from "zod";

export const openAccountSchema = z.object({
  nickname: z.string().min(2, "Nick name at least 2 characters"),
  mainpassword: z.string().min(6, "Main password at least 6 characters"),
  investorpassword: z.string().min(6, "Investor password at least 6 characters"),
});

export type OpenAccountFormData = z.infer<typeof openAccountSchema>;

// MT5 account schema

export const changePasswordSchema = z
  .object({
    passwordtype: z.enum(["main", "investor", "both"]),
    mainpassword: z.string().optional(),
    investorpassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if ((data.passwordtype === "main" || data.passwordtype === "both") && !data.mainpassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter your main password",
        path: ["mainpassword"],
      });
    }
    if (
      (data.passwordtype === "investor" || data.passwordtype === "both") &&
      !data.investorpassword
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Investor password required",
        path: ["investorpassword"],
      });
    }
  });

export const updateNicknameSchema = z.object({
  nickname: z.string().min(2, "Nick name at least 2 characters"),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateNicknameFormData = z.infer<typeof updateNicknameSchema>;
