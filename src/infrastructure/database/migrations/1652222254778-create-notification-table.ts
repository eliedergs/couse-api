import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMigration1652222254778 implements MigrationInterface {
    name = 'newMigration1652222254778';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "notification" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "message" character varying NOT NULL,
                "global" boolean NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "literatureId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"),
                CONSTRAINT "FK_09e37bca2f66dc27d36c233ac73" FOREIGN KEY ("literatureId") REFERENCES "literature"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"
        `);
        await queryRunner.query(`
            ALTER TABLE "notification" DROP CONSTRAINT "FK_09e37bca2f66dc27d36c233ac73"
        `);
        await queryRunner.query(`
            DROP TABLE "notification"
        `);
    }
}
