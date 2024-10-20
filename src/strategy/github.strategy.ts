import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('github.clientID'),
      clientSecret: configService.get('github.clientSecret'),
      callbackURL: configService.get('github.callbackURL'),
      scope: ['public_profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return profile;
  }
}
