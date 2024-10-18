import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: 'Ov23liR1iXGKQrXPS1JE',
      clientSecret: '89271672aa73e82bf08a2d67afc7c6def86d82dd',
      callbackURL: 'https://draw-bed.jsonq.top/oauth/github/redirect',
      scope: ['public_profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return profile;
  }
}
