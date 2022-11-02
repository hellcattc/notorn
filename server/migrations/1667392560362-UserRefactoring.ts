import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRefactoring1667392560362 implements MigrationInterface {
    name = 'UserRefactoring1667392560362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("userid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying, "password" character varying NOT NULL, "accessToken" character varying, CONSTRAINT "PK_db44d0349b007238b3c835f1fb9" PRIMARY KEY ("userid", "email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
