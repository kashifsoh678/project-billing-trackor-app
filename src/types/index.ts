/**
 * Shared TypeScript types
 */
import { Role, ProjectStatus, TimeLogStatus } from "./enums";

export { Role, ProjectStatus, TimeLogStatus };

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  billingRate: number;
  status: ProjectStatus;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeLog {
  id: string;
  projectId: string;
  userId: string;
  hours: number;
  notes: string | null;
  logDate: Date;
  status: TimeLogStatus;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
  };
}
export interface BillingSummary {
  totalHours: number;
  totalAmount: number;
  hoursByUser: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    hours: number;
    amount: number;
  }>;
  hoursByDate: Array<{
    date: string;
    hours: number;
    amount: number;
  }>;
}
