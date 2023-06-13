import { MigrationInterface, QueryRunner } from "typeorm"

export class Sai1686566968009 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "Employee" RENAME COLUMN "name" TO "employeename"`)
         await queryRunner.query(`EXEC sp_rename 'Employee.employeename','name','COLUMN'`)
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`EXEC sp_rename 'Employee.name','employeename','COLUMN'`)
    }

}
