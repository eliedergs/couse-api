import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import Course, { CourseModelEnum } from '../interfaces/course';

@Entity({ name: 'course', orderBy: { createdAt: 'ASC' } })
export default class CourseEntity implements Course {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nome: string;

    @Column({
        type: 'enum',
        enum: CourseModelEnum,
    })
    modelo: CourseModelEnum;

    @Column({ nullable: true })
    descricao: string;

    @Column()
    vagas: number | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(model: Partial<Course>) {
        Object.assign(this, model);
    }
}
