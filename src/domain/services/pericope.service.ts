import CreatePericopeDto from '@/application/dtos/pericope/create-pericope.dto';
import FilterPericopeDto from '@/application/dtos/pericope/filter.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import PericopeEntity from '../entities/pericope.entity';
import { PericopeType } from '../interfaces/literature';
import Pericope from '../interfaces/pericope';

@Injectable()
export default class PericopeService {
    constructor(@Inject('database') private dataSource: DataSource) {}

    createPericope(pericopeDto: CreatePericopeDto) {
        const repository = this.dataSource.getRepository(PericopeEntity);
        return repository.save(new PericopeEntity(pericopeDto));
    }

    findPericopeById(id: string) {
        const repository = this.dataSource.getRepository(PericopeEntity);
        return repository.findOne({ where: { id } });
    }

    findPericopesByUser(userId: string) {
        const repository = this.dataSource.getRepository(PericopeEntity);
        return repository
            .createQueryBuilder('pericope')
            .innerJoin('pericope.user', 'user')
            .innerJoinAndSelect('pericope.literature', 'literature')
            .leftJoinAndSelect('pericope.interactions', 'pericopeInteractions')
            .leftJoinAndSelect(
                'pericopeInteractions.user',
                'pericopeInteractionsUser',
            )
            .where('user.id = :userId', { userId })
            .getMany();
    }

    findPericopesByLiterature(
        literatureId: string,
        { pericopeType, text }: FilterPericopeDto = {},
    ): Promise<PericopeEntity[]> {
        if (pericopeType === PericopeType.NONE) {
            return Promise.resolve([]);
        }

        const repository = this.dataSource.getRepository(PericopeEntity);
        let query = repository
            .createQueryBuilder('pericope')
            .innerJoinAndSelect('pericope.user', 'user')
            .innerJoinAndSelect('pericope.literature', 'literature')
            .leftJoinAndSelect('pericope.interactions', 'pericopeInteractions')
            .leftJoinAndSelect(
                'pericopeInteractions.user',
                'pericopeInteractionsUser',
            )
            .where('literature.id = :literatureId', { literatureId });

        if (text) {
            query = query.andWhere('pericope.text = %:text%', { text });
        }

        switch (pericopeType) {
            case PericopeType.DRAFT:
                query = query.andWhere('pericope.order = 0');
                break;
            case PericopeType.TIMELINE:
                query = query.andWhere('pericope.order > 0');
                break;
            case PericopeType.PREVIEW:
                query = query.andWhere('pericope.order = 1');
                break;
            default:
                query = query.andWhere('pericope.order >= 0');
                break;
        }

        return query.getMany();
    }

    async addPericopeToTimeline(pericopeId: string) {
        const pericopeRepository =
            this.dataSource.getRepository(PericopeEntity);

        const pericope = await pericopeRepository.findOne({
            where: { id: pericopeId },
            relations: ['literature'],
        });

        const lastIndex = this.getLastIndexOfTimeline(
            pericope.literature.pericopes,
        );

        pericope.order = lastIndex + 1;
        await pericopeRepository.save(pericope);
    }

    async removePericopeById(pericopeId: string) {
        const repository = this.dataSource.getRepository(PericopeEntity);

        const pericope = await this.findPericopeById(pericopeId);

        if (!!pericope && pericope.order === 0) {
            await repository.remove(pericope);
        }
    }

    getLastIndexOfTimeline(timeline: Pericope[]) {
        return timeline.filter((p) => p.order > 0).length;
    }
}
