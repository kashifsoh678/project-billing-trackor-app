import { z } from "zod";
import { ProjectStatus, TimeLogStatus } from "@/types/enums";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  billingRate: z.coerce.number().min(0, "Billing rate must be positive"),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.ACTIVE),
});

export const timeLogSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  userId: z.string().min(1, "User ID is required").optional(), // Optional for now as we might take from session
  hours: z.coerce
    .number()
    .positive("Hours must be positive")
    .max(24, "Cannot log more than 24 hours"),
  notes: z.string().optional().nullable(),
  logDate: z.coerce.date(),
  status: z.nativeEnum(TimeLogStatus).default(TimeLogStatus.TODO),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"), // Match frontend regex
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ProjectInput = z.infer<typeof projectSchema>;
export type TimeLogInput = z.infer<typeof timeLogSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
