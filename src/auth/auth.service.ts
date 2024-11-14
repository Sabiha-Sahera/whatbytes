import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';  // Import UserService for user-related logic
import * as bcrypt from 'bcrypt';  // bcrypt for hashing and comparing passwords

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,  // Inject UserService for database operations
    private jwtService: JwtService,  // Inject JwtService for handling JWT operations
  ) {}

  // Validate the user by comparing the email and password
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);  // Retrieve user by email
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');  // If user not found, throw error
    }

    // Compare the given password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');  // If password doesn't match, throw error
    }

    return user;  // Return the user if credentials are valid
  }
  
  // Generate JWT token after successful login
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };  // Create payload with email and user ID
    
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'default-secret-key',  // Use environment variable or fallback to default
        expiresIn: '1h',  // Set expiration time for the token
      }),
    };
  }
}
