import { Controller, Get, Query, Post, Body, Req, UseFilters } from '@nestjs/common';
import { UserService } from 'src/service/user/user.service';
import { UserMstEntity } from 'src/entity/user-mst.entity';
import { CustomGLobalExceptionHandler } from 'src/CustomGLobalExceptionHandler';
import { ResponseObject } from 'src/model/response-object';
import { BusinessError } from 'src/model/business-error';
import { Constants } from 'src/model/constants';

@Controller('user')
@UseFilters(new CustomGLobalExceptionHandler())
export class UserController {

    constructor(private userService: UserService) {}

    @Get("/all")
    async findAll(): Promise<ResponseObject<UserMstEntity[]>> {
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<UserMstEntity[]> = new ResponseObject(be, await this.userService.findAll())
      return ro;
      
    }

    @Get("/find")
    async get(@Query('id') id: number): Promise<ResponseObject<UserMstEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<UserMstEntity> = new ResponseObject(be, await this.userService.findById(id))
      return ro;
    }

    @Post("/create")
    async create(@Req() req, @Body() user: UserMstEntity): Promise<BusinessError> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      await this.userService.create(user);        
      return be;
    }
    
    @Post("/update")
    async update(@Req() req, @Body() user: UserMstEntity): Promise<BusinessError> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      await this.userService.update(user.id, user);
      return be;
    }

}
