import InteractionDto from '@/application/dtos/interaction/interaction.dto';
import RegisterInteractionDto from '@/application/dtos/interaction/register-interaction.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import InteractionEntity from '../entities/interaction.entity';

@Injectable()
export default class InteractionService {
    constructor(@Inject('database') private dataSource: DataSource) {}

    async createInteraction(interactionDto: RegisterInteractionDto) {
        const interactionRepository =
            this.dataSource.getRepository(InteractionEntity);
        await interactionRepository.save(new InteractionEntity(interactionDto));
    }

    async findInteraction(interactionDto: Partial<InteractionDto>) {
        const where = {
            user: { id: interactionDto.user },
            type: interactionDto.type,
        };

        if (!!interactionDto?.pericope) {
            where['pericope'] = { id: interactionDto.pericope };
        }

        if (!!interactionDto?.literature) {
            where['literature'] = { id: interactionDto.literature };
        }

        const interactionRepository =
            this.dataSource.getRepository(InteractionEntity);
        return await interactionRepository.findOne({
            where,
            relations: ['user', 'literature', 'pericope'],
        });
    }

    async removeInteraction(interaction: InteractionEntity) {
        const interactionRepository =
            this.dataSource.getRepository(InteractionEntity);

        if (!!interaction) await interactionRepository.remove(interaction);
    }
}
