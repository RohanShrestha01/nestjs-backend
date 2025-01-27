import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { Auth } from './decorators/auth.decorator';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { AuthType } from './enums/auth-type-enum';
import { AuthService } from './providers/auth.service';
import { GoogleAuthenticationService } from './providers/google-authentication.service';

@Controller('auth')
@Auth(AuthType.None)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  googleAuthenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.googleAuthenticate(googleTokenDto);
  }
}
