import { Controller, Get } from '@nestjs/common';

@Controller('login')
export class LoginController {
    @Get()
    findAll(): string {
      return 'True';
    }
}
