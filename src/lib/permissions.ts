import { Role } from "@prisma/client";

/**
 * Permission definitions for RBAC
 * Defines what actions each role can perform
 */
export const permissions = {
  // Project permissions
  "project:create": [Role.ADMIN],
  "project:update": [Role.ADMIN],
  "project:delete": [Role.ADMIN],
  "project:archive": [Role.ADMIN],
  "project:view": [Role.ADMIN, Role.EMPLOYEE],

  // Time log permissions
  "timelog:create": [Role.ADMIN, Role.EMPLOYEE],
  "timelog:update:own": [Role.ADMIN, Role.EMPLOYEE],
  "timelog:update:any": [Role.ADMIN],
  "timelog:delete:own": [Role.ADMIN, Role.EMPLOYEE],
  "timelog:delete:any": [Role.ADMIN],
  "timelog:view:own": [Role.ADMIN, Role.EMPLOYEE],
  "timelog:view:any": [Role.ADMIN],

  // Billing permissions
  "billing:view": [Role.ADMIN],
} as const;

export type Permission = keyof typeof permissions;

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return (permissions[permission] as readonly Role[]).includes(role);
}

/**
 * Check if user can modify a specific time log
 * Admins can modify any, employees can only modify their own
 */
export function canModifyTimeLog(
  userRole: Role,
  userId: string,
  timeLogUserId: string,
): boolean {
  if (userRole === Role.ADMIN) {
    return true;
  }
  return userId === timeLogUserId;
}
