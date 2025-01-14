import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../../users/users.service';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    this.oauthClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async googleAuthenticate(googleTokenDto: GoogleTokenDto) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      const payload = loginTicket.getPayload();
      if (!payload?.email) throw new UnauthorizedException();
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = payload;

      const user = await this.usersService.findOneByGoogleId(googleId);
      if (user) {
        const tokens = await this.generateTokensProvider.generateTokens(user);
        return {
          ...tokens,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      }

      const newUser = await this.usersService.createGoogleUser({
        email,
        name: `${firstName} ${lastName}`,
        googleId,
      });

      const tokens = await this.generateTokensProvider.generateTokens(newUser);
      return {
        ...tokens,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
