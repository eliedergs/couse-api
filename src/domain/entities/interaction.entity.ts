import Interaction from '@domain/interfaces/interaction';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import LiteratureEntity from './literature.entity';
import PericopeEntity from './pericope.entity';
import UserEntity from './user.entity';

export enum InteractionType {
    LIKE = 'like',
    VIEW = 'view',
}

@Entity({ name: 'interaction', orderBy: { createdAt: 'ASC' } })
export default class InteractionEntity implements Interaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: InteractionType,
    })
    type: InteractionType;

    @ManyToOne(() => UserEntity, (user) => user.interactions, {
        nullable: false,
        cascade: true,
        onDelete: 'CASCADE',
    })
    user: UserEntity;

    @ManyToOne(
        () => LiteratureEntity,
        (literature) => literature.interactions,
        {
            nullable: true,
            cascade: true,
            onDelete: 'CASCADE',
        },
    )
    literature: LiteratureEntity | null;

    @ManyToOne(() => PericopeEntity, (pericope) => pericope.interactions, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
    })
    pericope: PericopeEntity | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(model: Partial<Interaction>) {
        Object.assign(this, model);
    }
}
