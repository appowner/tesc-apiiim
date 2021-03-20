import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './controller/login/login.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './controller/auth/auth.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController, LoginController, AuthController],
  providers: [AppService],
})
export class AppModule {}
