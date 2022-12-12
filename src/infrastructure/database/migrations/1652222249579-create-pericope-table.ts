import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPericopeTable1652222249579 implements MigrationInterface {
    name = 'createPericopeTable1652222249579';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "pericope" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "text" character varying NOT NULL,
                "order" integer NOT NULL DEFAULT '0',
                "userId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "literatureId" uuid,
                CONSTRAINT "PK_f75dc4db3d57581d2f293214f8d" PRIMARY KEY ("id"),
                CONSTRAINT "FK_42a042cc306048ec9b12b520a41" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_5eb544c3dff192d819e32fcb3d5" FOREIGN KEY ("literatureId") REFERENCES "literature"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pericope" DROP CONSTRAINT "FK_5eb544c3dff192d819e32fcb3d5"
        `);
        await queryRunner.query(`
            ALTER TABLE "pericope" DROP CONSTRAINT "FK_b3d4df4ff55c8ed28189680ae1a"
        `);
        await queryRunner.query(`
            DROP TABLE "pericope"
        `);
    }
}
