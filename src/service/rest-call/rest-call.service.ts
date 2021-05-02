import { HttpService, Injectable } from '@nestjs/common';
import { CustomerEntity } from 'src/entity/Customer.entity';
import { RouterConfigRepository } from 'src/repository/router.config.repository';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseObject } from 'src/model/response-object';
import { VendorEntity } from 'src/entity/Vendor.entity';
import { DriverEntity } from 'src/entity/Driver.entity';
import { EmployeeEntity } from 'src/entity/Employee.entity';

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

    async findCustomerByUserId(token : string, id: number): Promise<CustomerEntity> {
        let res: AxiosResponse<ResponseObject<CustomerEntity>> = await this.httpService.get<ResponseObject<CustomerEntity>>('http://localhost:35002/router/v1/customer/findByUserId?id=' + id, {headers : {authorization : 'Bearer '+token}}).toPromise();
        return res.data.res;
    }

    async findVendorByUserId(id: number): Promise<VendorEntity> {
        let res: AxiosResponse<ResponseObject<VendorEntity>> = await this.httpService.get<ResponseObject<VendorEntity>>(this.redirectMap.get('vendor') + 'vendor/findByUserId?id=' + id).toPromise();
        return res.data.res;
    }

    async findDriverByUserId(id: number): Promise<DriverEntity> {
        let res: AxiosResponse<ResponseObject<DriverEntity>> = await this.httpService.get<ResponseObject<DriverEntity>>(this.redirectMap.get('driver') + 'driver/findByUserId?id=' + id).toPromise();
        return res.data.res;
    }

    async findEmployeeByUserId(id: number): Promise<EmployeeEntity> {
        let res: AxiosResponse<ResponseObject<EmployeeEntity>> = await this.httpService.get<ResponseObject<EmployeeEntity>>(this.redirectMap.get('employee') + 'employee/findByUserId?id=' + id).toPromise();
        return res.data.res;
    }

}
