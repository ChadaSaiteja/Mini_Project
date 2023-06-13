
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { EmployeeDetails } from "./EmployeeDetails";

@Entity()
export class Location{
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    city:string

    @Column()
    country:string

    @OneToMany(()=>EmployeeDetails,(employeeDetails)=>employeeDetails.location)
    employeeDetails:EmployeeDetails[]

}