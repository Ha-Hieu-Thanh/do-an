import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskManagerMigration1710858770423 implements MigrationInterface {
    name = 'TaskManagerMigration1710858770423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`state\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`type\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`type\` tinyint UNSIGNED NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`status\` tinyint UNSIGNED NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`state\` tinyint UNSIGNED NOT NULL DEFAULT '2'`);
    }

}
