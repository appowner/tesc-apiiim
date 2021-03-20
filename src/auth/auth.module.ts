import { Module } from '@nestjs/common';
import { AuthService } from './service/auth/auth.service';
import { UserService } from './service/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from 'src/controller/auth/jwt.strategy';
import { AuthController } from 'src/controller/auth/auth.controller';
import { LocalStrategy } from 'src/controller/auth/local.strategy';

@Module({
  imports: [  
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
