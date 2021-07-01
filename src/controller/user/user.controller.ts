import { Controller, Get, Query, Post, Body, Req, UseFilters } from '@nestjs/common';
import { UserService } from 'src/service/user/user.service';
import { UserMstEntity } from 'src/entity/user-mst.entity';
import { CustomGLobalExceptionHandler } from 'src/CustomGLobalExceptionHandler';
import { ResponseObject } from 'src/model/response-object';
import { BusinessError } from 'src/model/business-error';
import { Constants } from 'src/model/constants';
import { RoleEntity } from 'src/entity/role.entity';
import { ClaimMasterEntity } from 'src/entity/claim-master.entity';

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

    @Get("/allRole")
    async allRole(@Query('id') id: number): Promise<ResponseObject<RoleEntity[]>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<RoleEntity[]> = new ResponseObject(be, await this.userService.findAllRole())
      return ro;
    }

    @Get("/findRole")
    async findRole(@Query('id') id: number): Promise<ResponseObject<RoleEntity>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let ro: ResponseObject<RoleEntity> = new ResponseObject(be, await this.userService.findRoleById(id))
      return ro;
    }

    @Post("/createRole")
    async creacreateRolete(@Req() req, @Body() role: RoleEntity): Promise<BusinessError> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      await this.userService.createRole(role);        
      return be;
    }
    
    @Post("/updateRole")
    async updupdateRole(@Req() req, @Body() role: RoleEntity): Promise<BusinessError> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      await this.userService.updateRole(role);
      return be;
    }

    @Get("/findRoleMapping")
    async findRoleMapping(@Query('userId') id: number): Promise<ResponseObject<{}>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let temp = await this.userService.getRoleByUserId(id);
      let ro: ResponseObject<{}> = new ResponseObject(be, temp)
      return ro;
    }

    @Get("/getRoleByUserIdForUpdate")
    async getRoleByUserIdForUpdate(@Query('userId') id: number): Promise<ResponseObject<{}>> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      let temp = await this.userService.getRoleByUserIdForUpdate(id);
      let ro: ResponseObject<{}> = new ResponseObject(be, temp)
      return ro;
    }

    @Post("/updateRoleClaims")
    async updateRoleClaims(@Req() req, @Body() claims: ClaimMasterEntity[]): Promise<BusinessError> {      
      let be: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);
      await this.userService.updateRoleClaims(claims);
      return be;
    }

}
