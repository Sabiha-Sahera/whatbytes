import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally accessible
      envFilePath: '.env', // Optional: You can specify the path to your environment file
    }),
    PassportModule,  // Passport for authentication strategy
    JwtModule.registerAsync({
      imports: [ConfigModule],  // Injecting ConfigModule for reading JWT_SECRET
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),  // Secret from environment
        signOptions: { expiresIn: '1h' },  // JWT token expiry duration
      }),
    }),
    UserModule,  // User module for user management logic
  ],
  providers: [AuthService, JwtStrategy],  // AuthService for logic and JwtStrategy for strategy
  controllers: [AuthController],  // AuthController for API endpoints
})
export class AuthModule {}
