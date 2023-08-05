import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDescEvent1690931548195 implements MigrationInterface {
    name = 'UpdateDescEvent1690931548195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event_volunteer\` (\`id\` varchar(36) NOT NULL, \`eventId\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`feedback\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event\` (\`id\` varchar(36) NOT NULL, \`image\` varchar(255) NOT NULL, \`creator\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`category\` enum ('Education', 'Volunteer', 'Subsidized') NOT NULL, \`location\` varchar(255) NOT NULL, \`volunteers\` int NOT NULL DEFAULT '0', \`maxVolunteers\` int NOT NULL, \`link\` varchar(255) NOT NULL, \`status\` enum ('PENDING', 'APPROVED', 'REJECT') NOT NULL DEFAULT 'PENDING', \`startDate\` datetime NOT NULL, \`endDate\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_f4ca2c1e7c96ae6e8a7cca9df8\` (\`username\`, \`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_f4ca2c1e7c96ae6e8a7cca9df8\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`event\``);
        await queryRunner.query(`DROP TABLE \`feedback\``);
        await queryRunner.query(`DROP TABLE \`event_volunteer\``);
    }

}
