import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {

    }


    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(username: string, password :  string) {
        const user = await this.validateUser(username, password);
        const payload = { sub : user.userId, username: username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
