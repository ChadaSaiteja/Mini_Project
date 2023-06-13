import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "./Employee";
import { Location } from "./Location";

@Entity()
export class EmployeeDetails{

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    experience:number

    @Column({length:10})
    salary:string

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    last_updated:Date

    @Column()
    phno:string

    @OneToOne(()=>Employee,{cascade:true,eager:true,onDelete:"CASCADE"})
    @JoinColumn()
    employee:Employee

    @ManyToOne(()=>Location,(location)=>location.employeeDetails,{cascade:true,eager:true,onDelete:"SET NULL"})
    location:Location

    
}