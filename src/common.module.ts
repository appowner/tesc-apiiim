import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './common/constants';
import { JwtStrategy } from 'src/controller/auth/jwt.strategy';
import { AuthController } from 'src/controller/auth/auth.controller';
import { LocalStrategy } from 'src/controller/auth/local.strategy';
import { AuthService } from './service/auth/auth.service';
import { UserService } from './service/user/user.service';
import { LoginController } from './controller/login/login.controller';
import { UserController } from './controller/user/user.controller';
import { AddressEntity } from './entity/address.entity';
import { UserMstEntity } from './entity/user-mst.entity';
import { UserMstRepository } from './repository/user-mst-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordEncryptionService } from './service/password-encryption/password-encryption.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { VendorEntity } from './entity/Vendor.entity';
import { VendorRepository } from './repository/vendor-repository';
import { VendorBankDetailEntity } from './entity/VendorBankDetail.entity';
import { VendorContractEntity } from './entity/VendorContract.entity';
import { VendorContractRouteEntity } from './entity/VendorContractRoute.entity';
import { EmployeeEntity } from './entity/Employee.entity';
import { EmployeeRepository } from './repository/employee.repository';
import { DriverEntity } from './entity/Driver.entity';
import { DriverRepository } from './repository/driver-repository';

@Module({
    imports: [  
      PassportModule,
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60m' },
      }),      
      TypeOrmModule.forFeature([AddressEntity, UserMstEntity, UserMstRepository,
        VendorEntity,VendorRepository,VendorContractRouteEntity,
        VendorBankDetailEntity,VendorContractEntity,EmployeeEntity,EmployeeRepository, DriverEntity,DriverRepository]),
    ],
    providers: [AuthService, UserService, LocalStrategy, JwtStrategy, PasswordEncryptionService],
    controllers: [LoginController, AuthController, UserController],
    
    exports: [AuthService]
  })
export class CommonModule {

    
}
