import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskManagerMigration1710854601888 implements MigrationInterface {
    name = 'TaskManagerMigration1710854601888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wiki\` DROP COLUMN \`type\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wiki\` ADD \`type\` tinyint UNSIGNED NOT NULL DEFAULT '2'`);
    }

}
