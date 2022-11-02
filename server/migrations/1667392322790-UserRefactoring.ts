import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRefactoring1667392322790 implements MigrationInterface {
    name = 'UserRefactoring1667392322790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "accessToken" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_pkey"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userid", "email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_db44d0349b007238b3c835f1fb9"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userid")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_email_key"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_pkey"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userid", "email")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_pkey"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userid")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_pkey"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_db44d0349b007238b3c835f1fb9" PRIMARY KEY ("userid", "email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_pkey"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userid")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "accessToken"`);
    }

}
