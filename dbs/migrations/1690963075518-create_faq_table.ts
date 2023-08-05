import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFaqTable1690963075518 implements MigrationInterface {
    name = 'CreateFaqTable1690963075518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`faq\` (\`id\` varchar(36) NOT NULL, \`question\` text NOT NULL, \`answer\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`faq\``);
    }

}
