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
import { CustomerPersonAssociationsEntity } from 'src/entity/customer-person-associations.entity';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class PersonService {

  constructor(private personRepository: PersonRepository, private emailMasterRepository: EmailMasterRepository, private personMobileMasterRepository: PersonMobileMasterRepository, private passwordEncryptionService: PasswordEncryptionService,
    private restCallService: RestCallService) {
  }


  public async findAll(req: Request): Promise<PersonEntity[]> {
    return await this.personRepository.find({ where: "is_deleted = '" + false + "'" });
  }


  public async findById(req: Request, id: number): Promise<PersonEntity | null> {
    let person = await this.personRepository.findOneOrFail(id, { where: "is_deleted = '" + false + "'" });
    let res = await Promise.all([
      this.getEmailMasterByPersonId(req, person.id),
      this.getMobileMasterByPersonId(req, person.id)
    ]);

    person.emailMasterObj = res[0];
    person.mobileMasterObj = res[1];
    return person;
  }

  public async findByRefId(req: Request, refId: number): Promise<PersonEntity | null> {
    return await this.personRepository.findOneOrFail({ where: "ref_id = '" + refId + "'" });
  }

  public async findByRefIdAndRefType(req: Request, refId: number, refType: string): Promise<PersonEntity | null> {
    let person = await this.personRepository.findOneOrFail({ where: "ref_id = '" + refId + "' and ref_type = '" + refType + "' and is_deleted = '" + false + "'" });
    let res = await Promise.all([
      this.getEmailMasterByPersonId(req, person.id),
      this.getMobileMasterByPersonId(req, person.id)
    ]);

    person.emailMasterObj = res[0];
    person.mobileMasterObj = res[1];
    return person;
  }

  public async findByRefType(req: Request, refType: string): Promise<PersonEntity[] | null> {
    return await this.personRepository.find({ where: "ref_type = '" + refType + "'" });
  }

  public async findByName(req: Request, name: string): Promise<PersonEntity | null> {
    return await this.personRepository.findOne({ where: "LOWER(name) = LOWER('" + name + "')" });
  }

  public async create(req: Request, personEntity: PersonEntity): Promise<PersonEntity> {
    
    console.log("REQUEST ================================================  "+ req);
    console.log("REQUEST =========****************************************  "+ req.headers.authorization);
    personEntity.isDeleted = false;
    personEntity.createdDate = new Date();
    const person = await this.personRepository.save(personEntity);

    if (personEntity.mobileNo) {
      let personMobileMasterObj = new PersonMobileMasterEntity();
      personMobileMasterObj.isActive = true;
      personMobileMasterObj.isDefault = true;
      personMobileMasterObj.mobileNo = personEntity.mobileNo;
      personMobileMasterObj.personId = person.id;
      await this.personMobileMasterRepository.save(personMobileMasterObj);
    }


    if (personEntity.email) {
      let emailMasterObj = new EmailMasterEntity();
      emailMasterObj.isActive = true;
      emailMasterObj.isDefault = true;
      emailMasterObj.email = personEntity.email;
      emailMasterObj.personId = person.id;
      await this.emailMasterRepository.save(emailMasterObj);
    }

    if(person && person.refType == 'CUSTOMER'){
      let customerPersonAssociation = new CustomerPersonAssociationsEntity();
      customerPersonAssociation.customerId = person.refId;
      customerPersonAssociation.isActive = true;
      customerPersonAssociation.isDefault = true;
      customerPersonAssociation.isOwner = true;
      customerPersonAssociation.personId = person.id;

      let res = await Promise.all([
        this.restCallService.createCustomerPersonAssociation(req, customerPersonAssociation)
      ]);
  }

    return person;
  }

  public async update(
    req: Request,
    id: number,
    newValue: PersonEntity,
  ): Promise<PersonEntity | null> {
    const personEntity = await this.personRepository.findOneOrFail(id);
    const personMobileMasterEntity = await this.personMobileMasterRepository.findOneOrFail({ where: "person_id = '" + id + "'" });
    const emailMasterEntity = await this.emailMasterRepository.findOneOrFail({ where: "person_id = '" + id + "'" });
    if (!personEntity.id) {
      console.error("PersonEntity doesn't exist");
    }

    if (!personMobileMasterEntity.MobileMasterId) {
      console.error("PersonMobileMasterEntity doesn't exist");
    }

    if (!emailMasterEntity.EmailMasterId) {
      console.error("Email Master Entity doesn't exist");
    }

    newValue.isDeleted = false;
    personEntity.updatedDate = new Date();
    await this.personRepository.save(newValue);

    if (personMobileMasterEntity.mobileNo !== newValue.mobileNo) {
      personMobileMasterEntity.mobileNo = newValue.mobileNo;
      await this.personMobileMasterRepository.save(personMobileMasterEntity);
    }

    if (emailMasterEntity.email !== newValue.email) {
      emailMasterEntity.email = newValue.email;
      await this.emailMasterRepository.save(emailMasterEntity);
    }

    return await this.personRepository.findOne(id);
  }

  public async delete(req: Request, id: number): Promise<PersonEntity> {

    let personEntity = await this.personRepository.findOneOrFail(id);
    const personMobileMasterEntity = await this.personMobileMasterRepository.findOneOrFail({ where: "person_id = '" + id + "'" });
    const emailMasterEntity = await this.emailMasterRepository.findOneOrFail({ where: "person_id = '" + id + "'" });

    if (!personEntity.id) {
      console.error("PersonEntity doesn't exist");
    }
    personEntity.isDeleted = true;
    let personObj = await this.personRepository.save(personEntity);

    if (!personMobileMasterEntity.MobileMasterId) {
      console.error("PersonMobileMasterEntity doesn't exist");
    }

    if (!emailMasterEntity.EmailMasterId) {
      console.error("Email Master Entity doesn't exist");
    }

    personMobileMasterEntity.isActive = false;
    await this.personMobileMasterRepository.save(personMobileMasterEntity);

    emailMasterEntity.isActive = false;
    await this.emailMasterRepository.save(emailMasterEntity);

    if (personObj.refType == 'CUSTOMER') {
      let res = await Promise.all([
        this.restCallService.deleteCustomerPersonAssociation(req, personObj.refId, personObj.id)
      ]);
    }
    return personObj;
  }


  public async findByEmail(req: Request, email: string): Promise<EmailMasterEntity | null> {
    return await this.emailMasterRepository.findOneOrFail({ where: "email = '" + email + "'" });
  }

  public async getEmailMasterByPersonId(req: Request, personId: number): Promise<EmailMasterEntity | null> {
    return await this.emailMasterRepository.findOneOrFail({ where: "person_id = '" + personId + "'" });
  }

  public async findByMobileNo(req: Request, mobileNo: string): Promise<PersonMobileMasterEntity | null> {
    return await this.personMobileMasterRepository.findOneOrFail({ where: "mobile_no = '" + mobileNo + "'" });
  }

  public async getMobileMasterByPersonId(req: Request, personId: number): Promise<PersonMobileMasterEntity | null> {
    return await this.personMobileMasterRepository.findOneOrFail({ where: "person_id = '" + personId + "'" });
  }
}
