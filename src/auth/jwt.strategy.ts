import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// JWT Strategy class for handling JWT validation in Passport
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // Configuring passport-jwt strategy
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      ignoreExpiration: false, // JWT expiration should not be ignored
      secretOrKey: configService.get<string>('JWT_SECRET'), // Get the secret key from environment or config
    });
  }

  // Validate the JWT payload and return user information
  async validate(payload: any) {
    // The payload contains user details; return the necessary fields for the user
    return { userId: payload.sub, email: payload.email };
  }
}
