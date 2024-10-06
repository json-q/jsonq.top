import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GithubStrategy } from '@/strategy/github.strategy';

@Module({
  controllers: [AuthController],
  providers: [GithubStrategy, AuthService],
})
export class AuthModule {}
