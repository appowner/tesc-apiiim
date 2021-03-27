export class BusinessError {

    constructor(code : number, message : string){
        this.code = code;
        this.message = message;
    }


    code : number;
    message : string;
}
