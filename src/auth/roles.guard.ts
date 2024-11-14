import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client'; // Import UserRole from Prisma client

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the roles metadata applied on the route
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    if (!requiredRoles) {
      return true;  // If no roles are required, allow access
    }

    // Get the request and user from the execution context
    const request = context.switchToHttp().getRequest();
    const user = request.user; // User data should already be added by AuthGuard

    if (!user) {
      throw new ForbiddenException('User not authenticated'); // Ensure the user is authenticated
    }

    // Check if the user's role matches any of the required roles for the route
    const hasRole = requiredRoles.some(role => role === user.role);
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions'); // If user doesn't have the required role
    }

    return true;  // Allow access if role matches
  }
}
