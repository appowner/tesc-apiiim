import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
@Injectable()
export class PasswordEncryptionService {

    constructor() {
        console.log("encrypt-:"+ this.encrypt("tesc@admin@108"));
        console.log("decrypt-:"+ this.decrypt(this.encrypt("tesc@admin@108")));
   
        console.log("encrypt-:"+ this.encrypt("changePassword"));
        console.log("decrypt-:"+ this.decrypt(this.encrypt("changePassword")));
       }
   
        decrypt = (encrypted: string) => {
         // console.log(`decrypting: ${encrypted}`);
         const key = CryptoJS.enc.Utf8.parse('uPfVxw5nykjNf9hF');
         const bytes = CryptoJS.AES.decrypt(encrypted, key, {iv: key});
         const plaintext = bytes.toString(CryptoJS.enc.Utf8);
         // console.log(`secret: ${plaintext}`);
         return plaintext;
       };
   
       encrypt = (encrypted: string) => {
         // console.log(`encrypted: ${encrypted}`);
         const key = CryptoJS.enc.Utf8.parse('uPfVxw5nykjNf9hF');          
         const plaintext = CryptoJS.AES.encrypt(encrypted, key, {iv: key}).toString();
         // console.log(`secret: ${plaintext}`);
         return plaintext;
       };

}
