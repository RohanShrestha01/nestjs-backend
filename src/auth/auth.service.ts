import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { HashingProvider } from './providers/hashing.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const foundUser = await this.usersService.findOneByEmail(loginDto.email);
    if (
      !foundUser ||
      !(await this.hashingProvider.comparePassword(
        loginDto.password,
        foundUser.password,
      ))
    )
      throw new UnauthorizedException('Incorrect email or password');

    const accessToken = await this.jwtService.signAsync(
      {
        sub: foundUser.id,
        email: foundUser.email,
      },
      { expiresIn: this.configService.getOrThrow('ACCESS_TOKEN_TTL') },
    );
    const { password, ...user } = foundUser;

    return {
      accessToken,
      user,
    };
  }
}
