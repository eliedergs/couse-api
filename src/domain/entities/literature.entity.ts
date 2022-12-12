import Literature from '@domain/interfaces/literature';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import InteractionEntity from './interaction.entity';
import NotificationEntity from './notification.entity';
import PericopeEntity from './pericope.entity';
import UserEntity from './user.entity';

export enum Genre {
    NARRATIVE = 'narrative',
    LYRIC = 'lyric',
}

@Entity({ name: 'literature', orderBy: { createdAt: 'ASC' } })
export default class LiteratureEntity implements Literature {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({
        type: 'enum',
        enum: Genre,
    })
    genre: Genre;

    @Column({ nullable: true })
    maxPericopes: number | null;

    @Column({ nullable: true })
    sizePericope: number | null;

    @ManyToOne(() => UserEntity, (user) => user.literatures, {
        nullable: false,
        cascade: true,
        onDelete: 'CASCADE',
    })
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => PericopeEntity, (pericope) => pericope.literature, {
        eager: true,
    })
    pericopes: PericopeEntity[];

    @OneToMany(() => InteractionEntity, (interaction) => interaction.literature)
    interactions: InteractionEntity[];

    @OneToMany(
        () => NotificationEntity,
        (notification) => notification.literature,
    )
    notifications: NotificationEntity[];

    constructor(model: Partial<Literature>) {
        Object.assign(this, model);
    }
}
