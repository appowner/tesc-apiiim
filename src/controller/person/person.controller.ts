import { Controller, Get, Query, Post, Body, Req, UseFilters } from '@nestjs/common';
import { UserService } from 'src/service/user/user.service';
import { UserMstEntity } from 'src/entity/user-mst.entity';
import { CustomGLobalExceptionHandler } from 'src/CustomGLobalExceptionHandler';
import { ResponseObject } from 'src/model/response-object';
import { BusinessError } from 'src/model/business-error';
import { Constants } from 'src/model/constants';
import { PersonService } from 'src/service/person/person.service';
import { PersonEntity } from 'src/entity/Person.entity';
import { EmailMasterEntity } from 'src/entity/email-master.entity';
import { PersonMobileMasterEntity } from 'src/entity/person-mobile-master.entity';

@Controller('person')
@UseFilters(new CustomGLobalExceptionHandler())
export class PersonController {

    constructor(private personService: PersonService) {}

    @Get("/all")
    async findAll(@Req() req): Promise<ResponseObject<PersonEntity[]>> {
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<PersonEntity[]> = new ResponseObject(be, await this.personService.findAll(req))
      return ro;
      
    }

    @Get("/find")
    async get(@Req() req,@Query('id') id: number): Promise<ResponseObject<PersonEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<PersonEntity> = new ResponseObject(be, await this.personService.findById(req,id))
      return ro;
    }

    @Get("/findByRefId")
    async findByRefId(@Req() req,@Query('refId') refId: number): Promise<ResponseObject<PersonEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<PersonEntity> = new ResponseObject(be, await this.personService.findByRefId(req,refId))
      return ro;
    }

    @Get("/findByRefIdAndRefType")
    async findByRefIdAndRefType(@Req() req,@Query('refId') refId: number,@Query('refType') refType: string): Promise<ResponseObject<PersonEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<PersonEntity> = new ResponseObject(be, await this.personService.findByRefIdAndRefType(req,refId,refType))
      return ro;
    }

    @Get("/findByRefType")
    async findByRefType(@Req() req,@Query('refType') refType: string): Promise<ResponseObject<PersonEntity[]>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<PersonEntity[]> = new ResponseObject(be, await this.personService.findByRefType(req,refType))
      return ro;
    }

    @Post("create")
    async create(@Req() req, @Body() person: PersonEntity): Promise<BusinessError> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      await this.personService.create(req,person);        
      return be;
    }
    
    @Post("/update")
    async update(@Req() req, @Body() person: PersonEntity): Promise<BusinessError> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      await this.personService.update(req,person.id, person);
      return be;
    }

    @Get("/findByEmail")
    async findByEmail(@Req() req,@Query('email') email: string): Promise<ResponseObject<EmailMasterEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<EmailMasterEntity> = new ResponseObject(be, await this.personService.findByEmail(req,email))
      return ro;
    }

    @Get("/getEmailMasterByPersonId")
    async getEmailMasterByPersonId(@Req() req,@Query('personId') personId: number): Promise<ResponseObject<EmailMasterEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<EmailMasterEntity> = new ResponseObject(be, await this.personService.getEmailMasterByPersonId(req,personId))
      return ro;
    }

    @Get("/findByMobileNo")
    async findByMobileNo(@Req() req,@Query('mobileNo') mobileNo: string): Promise<ResponseObject<PersonMobileMasterEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<PersonMobileMasterEntity> = new ResponseObject(be, await this.personService.findByMobileNo(req,mobileNo))
      return ro;
    }

    @Get("/getMobileMasterByPersonId")
    async getMobileMasterByPersonId(@Req() req,@Query('personId') personId: number): Promise<ResponseObject<PersonMobileMasterEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<PersonMobileMasterEntity> = new ResponseObject(be, await this.personService.getMobileMasterByPersonId(req,personId))
      return ro;
    }

}