import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordEncryptionService } from '../password-encryption/password-encryption.service';
import { Constants } from 'src/common/constants';
import { BusinessException } from 'src/model/business-exception';
import { AuthToken } from 'src/model/auth-token';
import { ResponseObject } from 'src/model/response-object';
import { BusinessError } from 'src/model/business-error';
import { UserMstEntity } from 'src/entity/user-mst.entity';
import { VendorRepository } from 'src/repository/vendor-repository';
import { EmployeeRepository } from 'src/repository/employee.repository';
import { DriverRepository } from 'src/repository/driver-repository';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private passwordEncryptionService : PasswordEncryptionService,
        private vendorRepository : VendorRepository     ,
        private employeeRepository : EmployeeRepository,
        private driverRepository : DriverRepository
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

    async generateOtp(contactNo: string) : Promise<ResponseObject<{}>> {
        const user = await this.usersService.findByContactNumber(contactNo);
        if (user) {
            // zelle
            let map = {};
            const otp =  Math.floor(1000 + Math.random() * 9000);
            map['otp'] = otp;
            map['type'] = user.type;
            if(user.type === "VENDOR"){
            let vendor = await this.vendorRepository.findOne({ where: "(user_mst_id) = ('" + user.id + "')" });
                map['vendorId'] = vendor.id;
            } else if(user.type === "EMPLOYEE"){
                let employee = await this.employeeRepository.findOne({ where: "(user_mst_id) = ('" + user.id + "')" });
                    map['employeeId'] = employee.id;
            } else if(user.type === "DRIVER"){
                let driver = await this.driverRepository.findOne({ where: "(user_mst_id) = ('" + user.id + "')" });
                    map['driverId'] = driver.id;
            }
            
            let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
            let ro: ResponseObject<{}> = new ResponseObject(be, map);
            return ro;
        }else{
            throw new BusinessException(Constants.FAILURE_CODE, Constants.INVALID_CREDENTIALS);
        }
    }

}
