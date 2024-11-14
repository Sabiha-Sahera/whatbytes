import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; // Key for storing roles metadata
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);  // Create a custom decorator for roles
