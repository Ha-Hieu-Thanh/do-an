import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskManagerMigration1720348469101 implements MigrationInterface {
    name = 'TaskManagerMigration1720348469101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`expire_retry_otp\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`retry_otp_count\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`retry_otp_count\` tinyint UNSIGNED NOT NULL COMMENT 'Số lần tài khoản nhập mã otp trong 1 khoảng thời gian' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`expire_retry_otp\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
