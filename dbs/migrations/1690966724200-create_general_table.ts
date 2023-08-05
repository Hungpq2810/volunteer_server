import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGeneralTable1690966724200 implements MigrationInterface {
    name = 'CreateGeneralTable1690966724200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`faq\` DROP COLUMN \`question\``);
        await queryRunner.query(`ALTER TABLE \`faq\` DROP COLUMN \`answer\``);
        await queryRunner.query(`ALTER TABLE \`faq\` ADD \`question\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`faq\` ADD \`answer\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`faq\` ADD \`k\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`faq\` ADD \`v\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`feedback\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`feedback\` ADD \`content\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`feedback\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`feedback\` ADD \`content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`faq\` DROP COLUMN \`v\``);
        await queryRunner.query(`ALTER TABLE \`faq\` DROP COLUMN \`k\``);
        await queryRunner.query(`ALTER TABLE \`faq\` DROP COLUMN \`answer\``);
        await queryRunner.query(`ALTER TABLE \`faq\` DROP COLUMN \`question\``);
        await queryRunner.query(`ALTER TABLE \`faq\` ADD \`answer\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`faq\` ADD \`question\` text NOT NULL`);
    }

}
