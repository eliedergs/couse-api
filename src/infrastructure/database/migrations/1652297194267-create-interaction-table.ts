import { MigrationInterface, QueryRunner } from 'typeorm';

export class createInteractionTable1652297194267 implements MigrationInterface {
    name = 'createInteractionTable1652297194267';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."interaction_type_enum" AS ENUM('like', 'view')
        `);
        await queryRunner.query(`
            CREATE TABLE "interaction" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" "public"."interaction_type_enum" NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                "literatureId" uuid,
                "pericopeId" uuid,
                CONSTRAINT "PK_9204371ccb2c9dab5428b406413" PRIMARY KEY ("id"),
                CONSTRAINT "FK_bfec87b7d90c185221bb0a4d1df" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_e7d26cf66bfb27d2f07e22a9315" FOREIGN KEY ("literatureId") REFERENCES "literature"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_e963bb2f1d144f07b6cd9716b27" FOREIGN KEY ("pericopeId") REFERENCES "pericope"("id") ON DELETE CASCADE ON UPDATE NO ACTION 
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "interaction" DROP CONSTRAINT "FK_e963bb2f1d144f07b6cd9716b27"
        `);
        await queryRunner.query(`
            ALTER TABLE "interaction" DROP CONSTRAINT "FK_e7d26cf66bfb27d2f07e22a9315"
        `);
        await queryRunner.query(`
            ALTER TABLE "interaction" DROP CONSTRAINT "FK_bfec87b7d90c185221bb0a4d1df"
        `);
        await queryRunner.query(`DROP TABLE "interaction"`);
        await queryRunner.query(`DROP TYPE "public"."interaction_type_enum"`);
    }
}
