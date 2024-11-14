import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';  // Import the DTO class

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' }) // Add a short description of the endpoint
  @ApiResponse({ status: 200, description: 'Login successful' }) // Success response
  @ApiResponse({ status: 401, description: 'Invalid credentials' }) // Invalid credentials response
  @ApiBody({
    description: 'User login credentials',
    type: LoginDto, // Reference the DTO class here
  })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      return { message: 'Invalid credentials' }; // Handle invalid login
    }
    return this.authService.login(user); // Generate JWT token and return it
  }
}
