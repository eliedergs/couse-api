import Pericope from '@domain/interfaces/pericope';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import LiteratureEntity from './literature.entity';
import InteractionEntity from './interaction.entity';
import UserEntity from './user.entity';

@Entity({ name: 'pericope', orderBy: { createdAt: 'ASC' } })
export default class PericopeEntity implements Pericope {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @Column({ default: 0 })
    order: number;

    @Column({ name: 'userId', type: 'uuid' })
    @ManyToOne(() => UserEntity, (user) => user.pericopes, {
        nullable: false,
        cascade: true,
        onDelete: 'CASCADE',
    })
    user: UserEntity;

    @ManyToOne(() => LiteratureEntity, (literature) => literature.pericopes, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
    })
    literature: LiteratureEntity;

    @OneToMany(() => InteractionEntity, (interaction) => interaction.pericope)
    interactions: InteractionEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(model: Partial<Pericope>) {
        Object.assign(this, model);
    }
}
