import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskManagerMigration1710857433207 implements MigrationInterface {
    name = 'TaskManagerMigration1710857433207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3d44ccf43b8a0d6b9978affb88\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_60e71e288bab95a5ac05f58a84\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`user_type\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`user_type\` tinyint UNSIGNED NOT NULL DEFAULT '2'`);
        await queryRunner.query(`CREATE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\` (\`email\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_60e71e288bab95a5ac05f58a84\` ON \`user\` (\`user_type\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_3d44ccf43b8a0d6b9978affb88\` ON \`user\` (\`status\`)`);
    }

}
