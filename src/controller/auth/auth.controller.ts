import { Controller, Request, Post, UseGuards, Get, Body, UseFilters } from '@nestjs/common';
import { JwtAuthGuard } from 'src/service/auth/jwt-auth-guard';
import { AuthService } from 'src/service/auth/auth.service';
import { LocalAuthGuard } from 'src/service/auth/local-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ResponseObject } from 'src/model/response-object';
import { CustomGLobalExceptionHandler } from 'src/CustomGLobalExceptionHandler';

@Controller('auth')
@UseFilters(new CustomGLobalExceptionHandler())
export class AuthController {

    constructor(private authService: AuthService, private jwtService: JwtService) {}

    // @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body("userName") userName: string, @Body("password") password: string) : Promise<ResponseObject<{}>> {
      return this.authService.login(userName, password);
    }

    @Post('getotp')
    async getotp(@Body("contactNo") contactNo: string) : Promise<ResponseObject<{}>> {
      return this.authService.generateOtp(contactNo);
    }
    
  
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      console.log("profile--:"+JSON.stringify(req.user));
      return req.user;
    }

}
