import { InteractionType } from '../entities/interaction.entity';
import Literature from './literature';
import Pericope from './pericope';
import User from './user';

export default interface Interaction {
    id: string;
    type: InteractionType;
    user: User | string;
    literature?: Literature | string;
    pericope?: Pericope | string;
    createdAt: Date | string;
}
