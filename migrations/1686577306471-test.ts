import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Test1686577306471 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'Post',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
               
            ],
        }));

        await queryRunner.createTable(new Table({
            name: 'Comment',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'title',
                    type: 'varchar',
                }]
                
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    
        await queryRunner.dropTable('Post');
      
        await queryRunner.dropTable('Comment');
    }


}
