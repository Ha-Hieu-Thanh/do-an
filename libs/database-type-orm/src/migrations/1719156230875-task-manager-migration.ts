import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskManagerMigration1719156230875 implements MigrationInterface {
    name = 'TaskManagerMigration1719156230875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`login_type\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`sns_id\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_test_account\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`is_test_account\` tinyint UNSIGNED NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`sns_id\` varchar(255) NULL COMMENT 'Id dang nhap cua ben thu ba'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`login_type\` tinyint UNSIGNED NULL COMMENT 'Type dang nhap cua ben thu ba eg. fb, yahoo...'`);
    }

}
