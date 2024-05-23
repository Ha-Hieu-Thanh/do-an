import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskManagerMigration1716481351613 implements MigrationInterface {
    name = 'TaskManagerMigration1716481351613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`project_issue_category\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`project_id\` bigint UNSIGNED NOT NULL, \`name\` varchar(255) NOT NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '2', \`issue_count\` bigint UNSIGNED NOT NULL DEFAULT '0', \`description\` varchar(3000) NULL, \`order\` bigint NULL, \`is_first\` tinyint NOT NULL DEFAULT 0, \`is_last\` tinyint NOT NULL DEFAULT 0, \`created_by\` bigint UNSIGNED NOT NULL, \`updated_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_2524d97b0e0aede5175c9edc1b\` (\`project_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_lead_category\` (\`user_project_id\` bigint UNSIGNED NOT NULL, \`project_id\` bigint UNSIGNED NOT NULL, \`created_by\` bigint UNSIGNED NOT NULL, \`updated_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`category_id\` bigint UNSIGNED NULL, PRIMARY KEY (\`user_project_id\`, \`project_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_project\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`user_id\` bigint UNSIGNED NOT NULL, \`project_id\` bigint UNSIGNED NOT NULL, \`role\` tinyint UNSIGNED NOT NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '2', \`issue_count\` bigint UNSIGNED NOT NULL DEFAULT '0', \`created_by\` bigint UNSIGNED NOT NULL, \`updated_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_d4d2d20dee6c2bdd62ace5ab99\` (\`role\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`status\` tinyint NOT NULL DEFAULT '1', \`type\` tinyint NULL, \`title\` varchar(500) NULL, \`content\` varchar(3000) NULL, \`redirect_id\` bigint UNSIGNED NULL, \`redirect_type\` tinyint NULL, \`target_type\` tinyint NOT NULL, \`target_id\` bigint UNSIGNED NULL, \`created_by\` bigint UNSIGNED NULL, \`deleted_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification_member\` (\`notification_id\` bigint UNSIGNED NOT NULL, \`user_id\` bigint UNSIGNED NOT NULL, \`is_read\` tinyint NOT NULL DEFAULT '0', \`status\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`notification_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`login_type\` tinyint UNSIGNED NULL COMMENT 'Type dang nhap cua ben thu ba eg. fb, yahoo...', \`sns_id\` varchar(255) NULL COMMENT 'Id dang nhap cua ben thu ba', \`name\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`retry_otp_count\` tinyint UNSIGNED NOT NULL COMMENT 'Số lần tài khoản nhập mã otp trong 1 khoảng thời gian' DEFAULT '0', \`expire_retry_otp\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`gender\` tinyint UNSIGNED NULL, \`address\` text NULL, \`birthday\` varchar(255) NULL, \`email\` varchar(255) NULL, \`password\` varchar(100) NULL, \`phone\` varchar(30) NULL, \`refresh_token\` varchar(500) NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '1', \`token_exp\` timestamp NULL, \`is_test_account\` tinyint UNSIGNED NOT NULL DEFAULT '0', \`invite_code\` varchar(255) NULL, \`token_forgot_password\` varchar(500) NULL, \`last_time_forgot_password\` varchar(255) NULL, \`role\` tinyint UNSIGNED NULL COMMENT 'Role cua user' DEFAULT '2', \`updated_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_issue_type\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`project_id\` bigint UNSIGNED NOT NULL, \`name\` varchar(255) NOT NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '2', \`background_color\` varchar(50) NOT NULL, \`issue_count\` bigint UNSIGNED NOT NULL DEFAULT '0', \`description\` varchar(3000) NULL, \`order\` bigint NULL, \`is_first\` tinyint NOT NULL DEFAULT 0, \`is_last\` tinyint NOT NULL DEFAULT 0, \`is_default\` tinyint NOT NULL DEFAULT 0, \`created_by\` bigint UNSIGNED NOT NULL, \`updated_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_975efaceace696ba9cc73871cd\` (\`project_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_version\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`project_id\` bigint UNSIGNED NOT NULL, \`name\` varchar(255) NOT NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '2', \`issue_count\` bigint UNSIGNED NOT NULL DEFAULT '0', \`start_date\` datetime NOT NULL, \`end_date\` datetime NULL, \`description\` varchar(3000) NULL, \`order\` bigint NULL, \`is_first\` tinyint NOT NULL DEFAULT 0, \`is_last\` tinyint NOT NULL DEFAULT 0, \`created_by\` bigint UNSIGNED NOT NULL, \`updated_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_2ffeb709a46febd677fee6a29d\` (\`project_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_issue_state\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`project_id\` bigint UNSIGNED NOT NULL, \`name\` varchar(255) NOT NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '2', \`background_color\` varchar(50) NOT NULL, \`issue_count\` bigint UNSIGNED NOT NULL DEFAULT '0', \`description\` varchar(3000) NULL, \`order\` bigint NULL, \`is_default\` tinyint NOT NULL DEFAULT 0, \`is_first\` tinyint NOT NULL DEFAULT 0, \`is_last\` tinyint NOT NULL DEFAULT 0, \`created_by\` bigint UNSIGNED NOT NULL, \`updated_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_34e1e55022ce1acf93b05774fd\` (\`project_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`issue_history\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`issue_id\` bigint UNSIGNED NOT NULL, \`project_id\` bigint UNSIGNED NOT NULL, \`metadata\` json NULL, \`type\` tinyint UNSIGNED NOT NULL, \`created_by\` bigint UNSIGNED NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_4681ed718496d0f84437480347\` (\`issue_id\`), INDEX \`IDX_77f6f9eaf232260854de01a61a\` (\`project_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`wiki\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`subject\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`project_id\` bigint UNSIGNED NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '1', \`created_by\` bigint UNSIGNED NOT NULL, \`updated_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_c580701d70344220d4fb06cff6\` (\`project_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`member_count\` bigint UNSIGNED NOT NULL DEFAULT '1', \`name\` varchar(255) NULL, \`key\` varchar(255) NOT NULL, \`avatar\` varchar(255) NULL, \`issue_count\` bigint UNSIGNED NOT NULL DEFAULT '0', \`created_by\` bigint UNSIGNED NOT NULL, \`updated_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_1778afd0b8f381a6aa80b44451\` (\`created_by\`), UNIQUE INDEX \`IDX_2db22c052f9ffdd51a6c113b37\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`issue\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`subject\` varchar(255) NULL, \`project_id\` bigint UNSIGNED NOT NULL, \`assignee_id\` bigint UNSIGNED NOT NULL, \`category_id\` bigint UNSIGNED NULL, \`state_id\` bigint UNSIGNED NULL, \`type_id\` bigint UNSIGNED NULL, \`version_id\` bigint UNSIGNED NULL, \`order\` bigint NOT NULL, \`description\` varchar(3000) NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '1', \`priority\` tinyint UNSIGNED NOT NULL DEFAULT '2', \`start_date\` varchar(20) NULL, \`due_date\` varchar(20) NULL, \`estimated_hours\` decimal(10,2) NULL, \`actual_hours\` decimal(10,2) NULL, \`created_by\` bigint UNSIGNED NOT NULL, \`updated_by\` bigint UNSIGNED NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_c5c1ee47a932087585aab345d4\` (\`project_id\`), INDEX \`IDX_441aa138f6eff35a6835c4b010\` (\`assignee_id\`), INDEX \`IDX_68e4d81f7efc753b45381d0634\` (\`category_id\`), INDEX \`IDX_6ec912c2553b5be72a1a306b80\` (\`state_id\`), INDEX \`IDX_cbaac4689773f8f434641a1b6b\` (\`type_id\`), INDEX \`IDX_0efbeaecb2ac737c4a15635e17\` (\`version_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`project_issue_category\` ADD CONSTRAINT \`FK_2524d97b0e0aede5175c9edc1ba\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_lead_category\` ADD CONSTRAINT \`FK_a831f78e8b5f2448782a4525231\` FOREIGN KEY (\`user_project_id\`) REFERENCES \`user_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_lead_category\` ADD CONSTRAINT \`FK_d5caa9034a4f6632a932ef2a0b8\` FOREIGN KEY (\`category_id\`) REFERENCES \`project_issue_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_dd66dc6a11849a786759c225537\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_project\` ADD CONSTRAINT \`FK_9f6abe80cbe92430eaa7a720c26\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification_member\` ADD CONSTRAINT \`FK_cb4c97a9fb681dffbab667a3810\` FOREIGN KEY (\`notification_id\`) REFERENCES \`notification\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification_member\` ADD CONSTRAINT \`FK_d7c08290dac2ff2715fe348bafb\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_issue_type\` ADD CONSTRAINT \`FK_975efaceace696ba9cc73871cd1\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_version\` ADD CONSTRAINT \`FK_2ffeb709a46febd677fee6a29d4\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_issue_state\` ADD CONSTRAINT \`FK_34e1e55022ce1acf93b05774fd0\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`issue_history\` ADD CONSTRAINT \`FK_4681ed718496d0f84437480347b\` FOREIGN KEY (\`issue_id\`) REFERENCES \`issue\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`issue_history\` ADD CONSTRAINT \`FK_77f6f9eaf232260854de01a61a4\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wiki\` ADD CONSTRAINT \`FK_c580701d70344220d4fb06cff61\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_1778afd0b8f381a6aa80b444519\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`issue\` ADD CONSTRAINT \`FK_c5c1ee47a932087585aab345d4c\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`issue\` DROP FOREIGN KEY \`FK_c5c1ee47a932087585aab345d4c\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_1778afd0b8f381a6aa80b444519\``);
        await queryRunner.query(`ALTER TABLE \`wiki\` DROP FOREIGN KEY \`FK_c580701d70344220d4fb06cff61\``);
        await queryRunner.query(`ALTER TABLE \`issue_history\` DROP FOREIGN KEY \`FK_77f6f9eaf232260854de01a61a4\``);
        await queryRunner.query(`ALTER TABLE \`issue_history\` DROP FOREIGN KEY \`FK_4681ed718496d0f84437480347b\``);
        await queryRunner.query(`ALTER TABLE \`project_issue_state\` DROP FOREIGN KEY \`FK_34e1e55022ce1acf93b05774fd0\``);
        await queryRunner.query(`ALTER TABLE \`project_version\` DROP FOREIGN KEY \`FK_2ffeb709a46febd677fee6a29d4\``);
        await queryRunner.query(`ALTER TABLE \`project_issue_type\` DROP FOREIGN KEY \`FK_975efaceace696ba9cc73871cd1\``);
        await queryRunner.query(`ALTER TABLE \`notification_member\` DROP FOREIGN KEY \`FK_d7c08290dac2ff2715fe348bafb\``);
        await queryRunner.query(`ALTER TABLE \`notification_member\` DROP FOREIGN KEY \`FK_cb4c97a9fb681dffbab667a3810\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_9f6abe80cbe92430eaa7a720c26\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP FOREIGN KEY \`FK_dd66dc6a11849a786759c225537\``);
        await queryRunner.query(`ALTER TABLE \`user_lead_category\` DROP FOREIGN KEY \`FK_d5caa9034a4f6632a932ef2a0b8\``);
        await queryRunner.query(`ALTER TABLE \`user_lead_category\` DROP FOREIGN KEY \`FK_a831f78e8b5f2448782a4525231\``);
        await queryRunner.query(`ALTER TABLE \`project_issue_category\` DROP FOREIGN KEY \`FK_2524d97b0e0aede5175c9edc1ba\``);
        await queryRunner.query(`DROP INDEX \`IDX_0efbeaecb2ac737c4a15635e17\` ON \`issue\``);
        await queryRunner.query(`DROP INDEX \`IDX_cbaac4689773f8f434641a1b6b\` ON \`issue\``);
        await queryRunner.query(`DROP INDEX \`IDX_6ec912c2553b5be72a1a306b80\` ON \`issue\``);
        await queryRunner.query(`DROP INDEX \`IDX_68e4d81f7efc753b45381d0634\` ON \`issue\``);
        await queryRunner.query(`DROP INDEX \`IDX_441aa138f6eff35a6835c4b010\` ON \`issue\``);
        await queryRunner.query(`DROP INDEX \`IDX_c5c1ee47a932087585aab345d4\` ON \`issue\``);
        await queryRunner.query(`DROP TABLE \`issue\``);
        await queryRunner.query(`DROP INDEX \`IDX_2db22c052f9ffdd51a6c113b37\` ON \`project\``);
        await queryRunner.query(`DROP INDEX \`IDX_1778afd0b8f381a6aa80b44451\` ON \`project\``);
        await queryRunner.query(`DROP TABLE \`project\``);
        await queryRunner.query(`DROP INDEX \`IDX_c580701d70344220d4fb06cff6\` ON \`wiki\``);
        await queryRunner.query(`DROP TABLE \`wiki\``);
        await queryRunner.query(`DROP INDEX \`IDX_77f6f9eaf232260854de01a61a\` ON \`issue_history\``);
        await queryRunner.query(`DROP INDEX \`IDX_4681ed718496d0f84437480347\` ON \`issue_history\``);
        await queryRunner.query(`DROP TABLE \`issue_history\``);
        await queryRunner.query(`DROP INDEX \`IDX_34e1e55022ce1acf93b05774fd\` ON \`project_issue_state\``);
        await queryRunner.query(`DROP TABLE \`project_issue_state\``);
        await queryRunner.query(`DROP INDEX \`IDX_2ffeb709a46febd677fee6a29d\` ON \`project_version\``);
        await queryRunner.query(`DROP TABLE \`project_version\``);
        await queryRunner.query(`DROP INDEX \`IDX_975efaceace696ba9cc73871cd\` ON \`project_issue_type\``);
        await queryRunner.query(`DROP TABLE \`project_issue_type\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`notification_member\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_d4d2d20dee6c2bdd62ace5ab99\` ON \`user_project\``);
        await queryRunner.query(`DROP TABLE \`user_project\``);
        await queryRunner.query(`DROP TABLE \`user_lead_category\``);
        await queryRunner.query(`DROP INDEX \`IDX_2524d97b0e0aede5175c9edc1b\` ON \`project_issue_category\``);
        await queryRunner.query(`DROP TABLE \`project_issue_category\``);
    }

}