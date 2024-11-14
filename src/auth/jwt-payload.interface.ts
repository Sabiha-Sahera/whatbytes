export interface JwtPayload {
  email: string; // The email associated with the user
  sub: string;   // The user ID, typically stored as 'sub' (subject) in JWT
}
