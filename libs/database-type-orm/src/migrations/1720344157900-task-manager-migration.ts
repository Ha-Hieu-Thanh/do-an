import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskManagerMigration1720344157900 implements MigrationInterface {
    name = 'TaskManagerMigration1720344157900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`token_exp\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`token_exp\` timestamp NULL`);
    }

}
