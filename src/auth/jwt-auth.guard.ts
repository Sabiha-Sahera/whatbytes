import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// This class extends the AuthGuard from Passport to implement JWT authentication guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // You can override methods here if you need custom behavior, 
  // but for now, it simply extends the default behavior of Passport's JWT strategy
}
