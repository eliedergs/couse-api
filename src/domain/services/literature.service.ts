import FilterLiteratureDto from '@/application/dtos/literature/filter.dto';
import LiteratureDto from '@/application/dtos/literature/literature.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import LiteratureEntity from '../entities/literature.entity';
import UserEntity from '../entities/user.entity';

@Injectable()
export default class LiteratureService {
    constructor(@Inject('database') private dataSource: DataSource) {}

    async createLiterature(
        createLiteratureDto: Partial<LiteratureDto>,
        userId: string,
    ) {
        const literatureRepository =
            this.dataSource.getRepository(LiteratureEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);
        const user = await userRepository.findOne({ where: { id: userId } });

        return await literatureRepository.save(
            new LiteratureEntity({
                ...createLiteratureDto,
                user: user,
            }),
        );
    }

    async findLiteraturesByFilter(filter: Partial<FilterLiteratureDto> = {}) {
        const repository = this.dataSource.getRepository(LiteratureEntity);
        const literatures = await repository.find({
            where: { ...filter },
            relations: [
                'interactions',
                'interactions.user',
                'pericopes',
                'user',
            ],
        });

        return literatures;
    }

    async findLiteraturesByUser(userId: string) {
        const repository = this.dataSource.getRepository(LiteratureEntity);
        const literatures = await repository
            .createQueryBuilder('literature')
            .leftJoinAndSelect('literature.pericopes', 'pericopes')
            .leftJoinAndSelect('literature.user', 'user')
            .leftJoinAndSelect(
                'literature.interactions',
                'literatureInteractions',
            )
            .leftJoinAndSelect(
                'literatureInteractions.user',
                'literatureInteractionsUser',
            )
            .where('user.id = :userId', { userId })
            .getMany();

        return literatures;
    }

    findLiteratureById(literatureId: string) {
        const repository = this.dataSource.getRepository(LiteratureEntity);
        return repository
            .createQueryBuilder('literature')
            .leftJoinAndSelect('literature.pericopes', 'pericopes')
            .orderBy('pericopes.order', 'ASC')
            .leftJoinAndSelect('literature.user', 'literatureUser')
            .leftJoinAndSelect('pericopes.user', 'pericopeUser')
            .leftJoinAndSelect('pericopes.interactions', 'pericopeInteractions')
            .leftJoinAndSelect(
                'pericopeInteractions.user',
                'pericopeInteractionsUser',
            )
            .leftJoinAndSelect(
                'literature.interactions',
                'literatureInteractions',
            )
            .leftJoinAndSelect(
                'literatureInteractions.user',
                'literatureInteractionsUser',
            )
            .where('literature.id = :literatureId', { literatureId })
            .getOne();
    }
}
