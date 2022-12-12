import Notification from '@domain/interfaces/notification';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import LiteratureEntity from './literature.entity';
import UserEntity from './user.entity';

@Entity({ name: 'notification', orderBy: { createdAt: 'ASC' } })
export default class NotificationEntity implements Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    message: string;

    @Column()
    global: boolean;

    @ManyToOne(
        () => LiteratureEntity,
        (literature) => literature.notifications,
        {
            nullable: true,
            cascade: true,
            onDelete: 'CASCADE',
        },
    )
    literature: LiteratureEntity | null;

    @ManyToOne(() => UserEntity, (user) => user.notifications, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
    })
    user: UserEntity | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(model: Partial<Notification>) {
        Object.assign(this, model);
    }
}
