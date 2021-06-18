import { Injectable } from '@nestjs/common';
import { UserMstRepository } from 'src/repository/user-mst-repository';
import { UserMstEntity } from 'src/entity/user-mst.entity';
import { DeleteResult } from 'typeorm';
import { BusinessError } from 'src/model/business-error';
import { BusinessException } from 'src/model/business-exception';
import { Constants } from 'src/model/constants';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import { PasswordEncryptionService } from 'src/auth/password-encryption/password-encryption.service';
import { RestCallService } from '../rest-call/rest-call.service';
import { Request } from 'express';
import { PersonRepository } from 'src/repository/person-repository';
import { PersonEntity } from 'src/entity/Person.entity';
import { PersonMobileMasterRepository } from 'src/repository/person-mobile-master-repository';
import { EmailMasterRepository } from 'src/repository/email-master-repository';
import { EmailMasterEntity } from 'src/entity/email-master.entity';
import { PersonMobileMasterEntity } from 'src/entity/person-mobile-master.entity';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class PersonService {

  constructor(private personRepository: PersonRepository,private emailMasterRepository: EmailMasterRepository, private personMobileMasterRepository: PersonMobileMasterRepository, private passwordEncryptionService: PasswordEncryptionService,
    private restCallService: RestCallService) {
  }


  public async findAll(req: Request): Promise<PersonEntity[]> {
    return await this.personRepository.find();
  }


  public async findById(req: Request,id: number): Promise<PersonEntity | null> {
    return await this.personRepository.findOneOrFail(id);
  }

  public async findByRefId(req: Request,refId: number): Promise<PersonEntity | null> {
    return await this.personRepository.findOneOrFail({ where: "refId = '" + refId + "'" });
  }

  public async findByRefIdAndRefType(req: Request,refId: number,refType:string): Promise<PersonEntity | null> {
    return await this.personRepository.findOneOrFail({ where: "refId = '" + refId + "' and refType = '" + refType + "'" });
  }

  public async findByRefType(req: Request,refType:string): Promise<PersonEntity[] | null> {
    return await this.personRepository.find({ where: "refType = '" + refType + "'" });
  }

  public async findByName(req: Request,name: string): Promise<PersonEntity | null> {
    return await this.personRepository.findOne({ where: "LOWER(name) = LOWER('" + name + "')" });
  }

  public async create(req: Request,personEntity: PersonEntity): Promise<PersonEntity> {
    const person = await this.personRepository.save(personEntity);

   if(personEntity.mobileNo){
     let personMobileMasterObj = new PersonMobileMasterEntity();
     personMobileMasterObj.isActive = true;
     personMobileMasterObj.isDefault = true;
     personMobileMasterObj.mobileNo = personEntity.mobileNo;
     personMobileMasterObj.personId = person.id;
      await this.personMobileMasterRepository.save(personMobileMasterObj);
   }


   if(personEntity.email){
    let emailMasterObj = new EmailMasterEntity();
    emailMasterObj.isActive = true;
    emailMasterObj.isDefault = true;
    emailMasterObj.email = personEntity.email;
    emailMasterObj.personId = person.id;
     await this.emailMasterRepository.save(emailMasterObj);
  }

    return person;
  }

  public async update(
    req: Request,
    id: number,
    newValue: PersonEntity,
  ): Promise<PersonEntity | null> {
    const personEntity = await this.personRepository.findOneOrFail(id);
    const personMobileMasterEntity = await this.personMobileMasterRepository.findOneOrFail({ where: "personId = '" + id + "'" });
    const emailMasterEntity = await this.emailMasterRepository.findOneOrFail({ where: "personId = '" + id + "'" });
    if (!personEntity.id) {
      console.error("PersonEntity doesn't exist");
    }

    if (!personMobileMasterEntity.MobileMasterId) {
      console.error("PersonMobileMasterEntity doesn't exist");
    }

    if (!emailMasterEntity.EmailMasterId) {
      console.error("Email Master Entity doesn't exist");
    }

    await this.personRepository.save(newValue);
    
    if(personMobileMasterEntity.mobileNo !== newValue.mobileNo){
      personMobileMasterEntity.mobileNo = newValue.mobileNo;
      await this.personMobileMasterRepository.save(personMobileMasterEntity);
    }

    if(emailMasterEntity.email !== newValue.email){
      emailMasterEntity.email = newValue.email;
      await this.emailMasterRepository.save(emailMasterEntity);
    }
    
    return await this.personRepository.findOne(id);
  }

  public async delete(req: Request,id: number): Promise<DeleteResult> {
    return await this.personRepository.delete(id);
  }


  public async findByEmail(req: Request,email: string): Promise<EmailMasterEntity | null> {
    return await this.emailMasterRepository.findOneOrFail({ where: "email = '" + email + "'" });
  }

  public async getEmailMasterByPersonId(req: Request,personId: number): Promise<EmailMasterEntity | null> {
    return await this.emailMasterRepository.findOneOrFail({ where: "personId = '" + personId + "'" });
  }

  public async findByMobileNo(req: Request,mobileNo: string): Promise<PersonMobileMasterEntity | null> {
    return await this.personMobileMasterRepository.findOneOrFail({ where: "mobileNo = '" + mobileNo + "'" });
  }

  public async getMobileMasterByPersonId(req: Request,personId: number): Promise<PersonMobileMasterEntity | null> {
    return await this.personMobileMasterRepository.findOneOrFail({ where: "personId = '" + personId + "'" });
  }
}
