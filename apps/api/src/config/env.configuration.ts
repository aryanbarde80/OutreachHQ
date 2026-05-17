import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/outreachhq',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  apiPort: Number(process.env.API_PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  uploadDir: process.env.UPLOAD_DIR ?? './uploads',
  smtpEncryptionKey: process.env.SMTP_ENCRYPTION_KEY ?? 'replace-with-32-char-key',
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  },
}));

