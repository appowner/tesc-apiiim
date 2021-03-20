import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/service/auth/jwt-auth-guard';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/service/auth/local-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    // @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body("userName") userName: string, @Body("password") password: string) {
      return this.authService.login(userName, password);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      console.log("profile--:"+JSON.stringify(req.user));
      return req.user;
    }

}
