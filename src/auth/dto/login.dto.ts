// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com', // Example for Swagger UI
  })
  @IsEmail()
  email: string = ''; // Initialize with an empty string (or any default value)

  @ApiProperty({
    description: 'User password',
    example: 'password123', // Example for Swagger UI
  })
  @IsString()
  password: string = ''; // Initialize with an empty string (or any default value)
}

