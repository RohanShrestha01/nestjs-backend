import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { BcryptProvider } from './providers/bcrypt.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { HashingProvider } from './providers/hashing.provider';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
    GenerateTokensProvider,
    GoogleAuthenticationService,
  ],
  controllers: [AuthController],
  exports: [HashingProvider],
})
export class AuthModule {}
