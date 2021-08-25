import { Catch, ArgumentsHost, Inject, HttpServer, HttpStatus, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { BusinessException } from 'src/model/business-exception';
import { BusinessError } from 'src/model/business-error';
import { Constants } from './model/constants';
import { ResponseObject } from './model/response-object';



@Catch()
export class CustomGLobalExceptionHandler extends BaseExceptionFilter {


  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();
    // const status = exception.getStatus();

    console.error(exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let message: BusinessError = new BusinessError(Constants.SUCCESS_CODE, Constants.SUCCESS_RES);

    if (exception instanceof BusinessException) {
      message.code = exception.errCode;
      message.message = exception.errMsg;
    }else if (exception instanceof HttpException) {
      if (exception.getStatus() == 401) {
        status = HttpStatus.UNAUTHORIZED;
        message.code = Constants.FAILURE_CODE;
        message.message = exception.message;
      }

    } else {
      message.code = Constants.FAILURE_CODE;
      message.message = Constants.FAILURE_RES;
    }

    let ro = new ResponseObject(message, null);
    console.log("ro--: "+JSON.stringify(ro));
    response
      .status(status)
      .json(JSON.stringify(ro));
  }
}