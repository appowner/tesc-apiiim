import { HttpService, Injectable } from '@nestjs/common';
import { CustomerEntity } from 'src/entity/Customer.entity';
import { RouterConfigRepository } from 'src/repository/router.config.repository';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseObject } from 'src/model/response-object';
import { VendorEntity } from 'src/entity/Vendor.entity';
import { DriverEntity } from 'src/entity/Driver.entity';
import { EmployeeEntity } from 'src/entity/Employee.entity';
import { Request } from 'express';

@Injectable()
export class RestCallService {
    redirectMap: Map<string, string> = new Map();

    constructor(private httpService: HttpService, private routerConfigRepository: RouterConfigRepository) {
        this.routerConfigRepository.find().then(list => {
            list.forEach(element => {
                this.redirectMap.set(element.selector, element.redirectUrl);
            });
        })
    }

    async findCustomerByUserId(token: string, id: number): Promise<CustomerEntity> {
        let res: AxiosResponse<ResponseObject<CustomerEntity>> = await this.httpService.get<ResponseObject<CustomerEntity>>(process.env.ROUTER_URL + 'customer/findByUserId?id=' + id, { headers: { authorization: 'Bearer ' + token } }).toPromise();
        return res.data.res;
    }

    async findVendorByUserId(token: string, id: number): Promise<VendorEntity> {
        let res: AxiosResponse<ResponseObject<VendorEntity>> = await this.httpService.get<ResponseObject<VendorEntity>>(process.env.ROUTER_URL + 'vendor/findByUserId?id=' + id, { headers: { authorization: 'Bearer ' + token } }).toPromise();
        return res.data.res;
    }

    async findDriverByUserId(token: string, id: number): Promise<DriverEntity> {
        let res: AxiosResponse<ResponseObject<DriverEntity>> = await this.httpService.get<ResponseObject<DriverEntity>>(process.env.ROUTER_URL + 'driver/findByUserId?id=' + id, { headers: { authorization: 'Bearer ' + token } }).toPromise();
        return res.data.res;
    }

    async findEmployeeByUserId(token: string, id: number): Promise<EmployeeEntity> {
        let res: AxiosResponse<ResponseObject<EmployeeEntity>> = await this.httpService.get<ResponseObject<EmployeeEntity>>(process.env.ROUTER_URL + 'employee/findByUserId?id=' + id, { headers: { authorization: 'Bearer ' + token } }).toPromise();
        return res.data.res;
    }

    async sendMail(req: Request, mailId: string[], subject: string, body: string): Promise<ResponseObject<{}>> {
        let res: AxiosResponse<ResponseObject<ResponseObject<{}>>> = await this.httpService.post<ResponseObject<ResponseObject<{}>>>(process.env.ROUTER_URL + 'notification/sendMail',
            { mailIds: mailId, subject: subject, body: body }).toPromise();
        return res.data.res;
    }



}