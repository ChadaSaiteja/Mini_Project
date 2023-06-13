import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";


@Entity()
export class Project{
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    name:string

    @ManyToMany(()=>Employee,employee => employee.projects,{cascade:true,eager:true})
    @JoinTable({ name: 'project_employee_employee' })
    employee:Employee[]
}

