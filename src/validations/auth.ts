import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  displayName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(250).optional(),
  dailyGoal: z.number().int().min(1).max(10).optional(),
  reminderTime: z.string().optional(),
  themePreferences: z.string().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
