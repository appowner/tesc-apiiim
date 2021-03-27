export class BusinessException extends Error{

    constructor(errCode : number, errMsg : string){
        super(errMsg);
        this.errCode = errCode;
        this.errMsg = errMsg;
        this.name = errMsg;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }

    errCode : number;
    errMsg : string;
}