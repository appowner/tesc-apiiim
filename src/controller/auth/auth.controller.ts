import { Controller, Request, Post, UseGuards, Get, Body, UseFilters, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { AuthService } from 'src/service/auth/auth.service';

import { JwtService } from '@nestjs/jwt';
import { ResponseObject } from 'src/model/response-object';
import { CustomGLobalExceptionHandler } from 'src/CustomGLobalExceptionHandler';


@Controller('auth')
@UseFilters(new CustomGLobalExceptionHandler())
export class AuthController {

  constructor(private authService: AuthService, private jwtService: JwtService) { }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body("userName") userName: string, @Body("password") password: string, @Body("otp") otp: string): Promise<ResponseObject<{}>> {
    return this.authService.login(userName, password,otp);
  }


  @Post('forgotPassword')
  async forgotPassword(@Body("email") email: string): Promise<ResponseObject<{}>> {
    return this.authService.forgotPasswordLinkGenerate(email);
  }

  @Post('changePassword')
  async changePassword(@Body("token") token: string, @Body("oldPassword") oldPassword: string, @Body("newPassword") newPassword): Promise<ResponseObject<{}>> {
    return this.authService.changePassword(token, oldPassword, newPassword);
  }

  @Post('validateToken')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Body() token: string, @Req() req) {
    return this.authService.validateToken(token, req.user);

  }

  @Post('getotp')
  async getotp(@Body("contactNo") contactNo: string): Promise<ResponseObject<{}>> {
    return this.authService.generateOtp(contactNo);
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log("profile--:" + JSON.stringify(req.user));
    return req.user;
  }

}
