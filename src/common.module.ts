import { HttpModule, Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from 'src/controller/auth/auth.controller';

import { AuthService } from './service/auth/auth.service';
import { UserService } from './service/user/user.service';
import { LoginController } from './controller/login/login.controller';
import { UserController } from './controller/user/user.controller';
import { AddressEntity } from './entity/address.entity';
import { UserMstEntity } from './entity/user-mst.entity';
import { UserMstRepository } from './repository/user-mst-repository';
import { TypeOrmModule } from '@nestjs/typeorm';

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
import { CustomerEntity } from './entity/Customer.entity';
import { CustomerContractEntity } from './entity/CustomerContract.entity';
import { CustomerContractRouteEntity } from './entity/CustomerContractRoute.entity';
import { CustomerRepository } from './repository/customer-repository';
import { jwtConstants } from './model/constants';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { PasswordEncryptionService } from './auth/password-encryption/password-encryption.service';
import { RestCallService } from './service/rest-call/rest-call.service';
import { RouterConfigRepository } from './repository/router.config.repository';
import { PersonRepository } from './repository/person-repository';
import { PersonEntity } from './entity/Person.entity';
import { PersonMobileMasterRepository } from './repository/person-mobile-master-repository';
import { PersonMobileMasterEntity } from './entity/person-mobile-master.entity';
import { EmailMasterEntity } from './entity/email-master.entity';
import { EmailMasterRepository } from './repository/email-master-repository';

@Module({
    imports: [  
      PassportModule,
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60m' },
      }),
      // VendorEntity,VendorRepository,VendorContractRouteEntity,
      // VendorBankDetailEntity,VendorContractEntity,EmployeeEntity,EmployeeRepository, DriverEntity,DriverRepository,      
      TypeOrmModule.forFeature([AddressEntity, UserMstEntity, UserMstRepository,PersonRepository, PersonEntity,
        PersonMobileMasterRepository,PersonMobileMasterEntity,EmailMasterEntity,EmailMasterRepository,
       RouterConfigRepository]),
      HttpModule
    ],
    providers: [AuthService, UserService, LocalStrategy, JwtStrategy, PasswordEncryptionService, RestCallService],
    controllers: [LoginController, AuthController, UserController],
    
    exports: [AuthService]
  })
export class CommonModule {

    
}
