import { Controller, Get, Query, Post, Body, Req, UseFilters, Delete } from '@nestjs/common';
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
    async create(@Req() req, @Body() person: PersonEntity): Promise<ResponseObject<PersonEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<PersonEntity> = new ResponseObject(be, await this.personService.create(req,person));        
      return ro;
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

    @Post("/createEmailMaster")
    async createEmail(@Req() req, @Body() emailMaster: EmailMasterEntity): Promise<ResponseObject<EmailMasterEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<EmailMasterEntity> = new ResponseObject(be, await this.personService.createEmailMaster(req,emailMaster));        
      return ro;
    }
    
    @Post("/updateEmailMasterByPersonId")
    async updateEmail(@Req() req, @Body() emailMaster: EmailMasterEntity): Promise<BusinessError> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      await this.personService.updateEmailMasterByPersonId(req,emailMaster.EmailMasterId, emailMaster);
      return be;
    }

    @Get("/deleteEmailMaster")
    async deleteEmailMaster(@Req() req,@Query('id') id: number): Promise<BusinessError> {
      await this.personService.deleteEmailMaster(req,id);
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      return be;
    }
    
    @Post("/createMobileMaster")
    async createMobileMaster(@Req() req, @Body() mobileMaster: PersonMobileMasterEntity): Promise<ResponseObject<PersonMobileMasterEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<PersonMobileMasterEntity> = new ResponseObject(be, await this.personService.createMobileMaster(req,mobileMaster));        
      return ro;
    }
    
    @Post("/updateMobileMasterByPersonId")
    async updateMobileMasterByPersonId(@Req() req, @Body() mobileMaster: PersonMobileMasterEntity): Promise<BusinessError> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      await this.personService.updateMobileMasterByPersonId(req,mobileMaster.MobileMasterId, mobileMaster);
      return be;
    }

    @Get("/deleteMobileMaster")
    async deleteMobileMaster(@Req() req,@Query('id') id: number): Promise<BusinessError> {
      await this.personService.deleteEmailMaster(req,id);
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      return be;
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

   

    @Get("/delete")
    async delete(@Req() req,@Query('id') id: number): Promise<BusinessError> {
      await this.personService.delete(req,id);
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      return be;
    }

}