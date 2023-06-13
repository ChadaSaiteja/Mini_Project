import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EmployeeDetails } from "./EmployeeDetails";
import { Project } from "./Project";

@Entity()
export class Employee{
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    name:string

    @OneToOne(()=>EmployeeDetails,{onDelete:"CASCADE"})
    employeeDetails:EmployeeDetails

    
    @ManyToMany(() => Project, project => project.employee,{onDelete:'CASCADE'})
    projects: Project[];

}