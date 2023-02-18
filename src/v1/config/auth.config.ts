import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  adminSecret: process.env.AUTH_JWT_SECRET || 'secret',
  userSecret: process.env.AUTH_JWT_SECRET_USER || 'secret',
  ottDigitsCount: process.env.OTT_DIGITS_COUNT && parseInt(process.env.OTT_DIGITS_COUNT) || 6,
  ottExpireDurationMinutes: process.env.OTT_EXPIRATION_MINUTES && parseInt(process.env.OTT_EXPIRATION_MINUTES) || 5,
  expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN || '7d',
  refreshTokenExpires: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN || '30d',
}));
