import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { UsersService } from '../../users/users.service';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const foundUser = await this.usersService.findOneByEmail(loginDto.email);
    if (
      !foundUser?.password ||
      !(await this.hashingProvider.comparePassword(
        loginDto.password,
        foundUser.password,
      ))
    )
      throw new UnauthorizedException('Incorrect email or password');

    const tokens = await this.generateTokensProvider.generateTokens(foundUser);

    return {
      ...tokens,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { sub } = await this.jwtService.verifyAsync<
      Pick<ActiveUserData, 'sub'>
    >(refreshTokenDto.refreshToken);

    const user = await this.usersService.findOne(sub);

    return await this.generateTokensProvider.generateTokens(user);
  }
}
