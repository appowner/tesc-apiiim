import { HttpService, Injectable } from '@nestjs/common';
import { CustomerEntity } from 'src/entity/Customer.entity';
import { RouterConfigRepository } from 'src/repository/router.config.repository';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseObject } from 'src/model/response-object';

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

    async findCustomerByUserId(id: number): Promise<CustomerEntity> {
        let res: AxiosResponse<ResponseObject<CustomerEntity>> = await this.httpService.get<ResponseObject<CustomerEntity>>(this.redirectMap.get('customer') + 'customer/findByUserId?id=' + id).toPromise();
        return res.data.res;
    }

}
