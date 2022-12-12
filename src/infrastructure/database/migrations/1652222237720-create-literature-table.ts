import { MigrationInterface, QueryRunner } from 'typeorm';

export class createLiteratureTable1652222237720 implements MigrationInterface {
    name = 'createLiteratureTable1652222237720';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."literature_genre_enum" AS ENUM('narrative', 'lyric')
        `);
        await queryRunner.query(`
            CREATE TABLE "literature" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "genre" "public"."literature_genre_enum" NOT NULL,
                "maxPericopes" integer,
                "sizePericope" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_362a299d15fc481c785af9ea387" PRIMARY KEY ("id"),
                CONSTRAINT "FK_03779392f37458ecf96f701d253" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION 
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "literature" DROP CONSTRAINT "FK_ea9e224d1c4f102a3fc4d66ec3f"
        `);
        await queryRunner.query(`
            DROP TABLE "literature"
        `);
    }
}
