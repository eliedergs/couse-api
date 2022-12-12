import User from '@domain/interfaces/user';
import * as bcrypt from 'bcryptjs';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

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
