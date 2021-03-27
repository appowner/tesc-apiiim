import { BusinessError } from "./business-error";

export class ResponseObject<T> {

    constructor(be : BusinessError, res : T){
        this.businessError = be;
        this.res = res;
    }

    businessError : BusinessError;
    res : T;
}
