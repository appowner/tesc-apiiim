import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "security_policy" })
export class SecurityPolicyEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name : "min_pass_length"})
    minPassLength: number;

    @Column({name : "pwd_exp_days"})
    pwdExpDays: number;

    @Column({name : "user_prom_days"})
    userPromDays: number;

    @Column({name : "lock_attem"})
    lockAttem: number;

    @Column({name : "lock_duration"})
    lockDuration: number;

    @Column({name : "dup_pwd_lst"})
    dupPwdLst: number;

    
    createdBy: number;

    
    createdDate: Date;

    
    updateBy: Date;

    
    updatedDate: Date;

    @Column({name : "is_number"})
    isNumber: number;

    @Column({name : "is_upper_case"})
    isUpperCase: number;

    @Column({name : "is_symbol"})
    isSymbol: number;

    
    manufid: number;

    @Column({name : "max_pass_length"})
    maxPassLength: number;

}
