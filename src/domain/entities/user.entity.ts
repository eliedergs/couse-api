import User from '@domain/interfaces/user';
import * as bcrypt from 'bcryptjs';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import InteractionEntity from './interaction.entity';
import LiteratureEntity from './literature.entity';
import NotificationEntity from './notification.entity';
import PericopeEntity from './pericope.entity';

@Entity({ name: 'user', orderBy: { createdAt: 'ASC' } })
export default class UserEntity implements User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    photo: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    bio: string;

    @OneToMany(() => LiteratureEntity, (literature) => literature.user)
    literatures: LiteratureEntity[];

    @OneToMany(() => PericopeEntity, (pericope) => pericope.user, {
        eager: true,
    })
    pericopes: PericopeEntity[];

    @OneToMany(() => NotificationEntity, (notification) => notification.user)
    notifications: NotificationEntity[];

    @OneToMany(() => InteractionEntity, (interaction) => interaction.user)
    interactions: InteractionEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(model: Partial<User>) {
        Object.assign(this, model);
    }

    @BeforeInsert()
    @BeforeUpdate()
    async setPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
}
