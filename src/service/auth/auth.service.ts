import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordEncryptionService } from '../password-encryption/password-encryption.service';
import { Constants } from 'src/common/constants';
import { BusinessException } from 'src/model/business-exception';
import { AuthToken } from 'src/model/auth-token';
import { ResponseObject } from 'src/model/response-object';
import { BusinessError } from 'src/model/business-error';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private passwordEncryptionService : PasswordEncryptionService
    ) {

    }


    async validateUser(username: string, pass: string): Promise<ResponseObject<{}>> {
        const user = await this.usersService.findByUserName(username);
        if (user && this.passwordEncryptionService.decrypt(user.password) === pass) {
            const payload = { userName: user.userName, sub: user.id };
            let map = {};
            map["token"] =  new AuthToken(this.jwtService.sign(payload));
            user.password = "";
            map["user"] = user;
            let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
            let ro: ResponseObject<{}> = new ResponseObject(be, map);
            return ro;
        }else{
            throw new BusinessException(Constants.FAILURE_CODE, Constants.INVALID_CREDENTIALS);
        }
        
    }

    async login(username: string, password :  string) : Promise<ResponseObject<{}>> {
        return await this.validateUser(username, password);        
    }

}
