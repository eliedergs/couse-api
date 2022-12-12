import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCourseTable1652222237720 implements MigrationInterface {
    name = 'createCourseTable1652222237720';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."course_model" AS ENUM('presencial', 'online')
        `);
        await queryRunner.query(`
            CREATE TABLE "course" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "nome" VARCHAR (180) NOT NULL,
                "modelo" "public"."course_model" NOT NULL,
                "descricao" VARCHAR,
                "vagas" integer DEFAULT 0,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "literature" DROP CONSTRAINT "FK_ea9e224d1c4f102a3fc4d66ec3f"
        `);
        await queryRunner.query(`
            DROP TABLE "course"
        `);
    }
}
