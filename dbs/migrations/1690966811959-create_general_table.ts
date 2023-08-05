import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGeneralTable1690966811959 implements MigrationInterface {
    name = 'CreateGeneralTable1690966811959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`general\` (\`id\` varchar(36) NOT NULL, \`k\` varchar(255) NOT NULL, \`v\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`faq\` DROP COLUMN \`k\``);
        await queryRunner.query(`ALTER TABLE \`faq\` DROP COLUMN \`v\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`faq\` ADD \`v\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`faq\` ADD \`k\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`general\``);
    }

}
