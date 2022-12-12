import Interaction from './interaction';
import Literature from './literature';
import User from './user';

export default interface Pericope {
    id: string;
    text: string;
    order: number;
    user?: User | string;
    literature?: Literature | string;
    interactions?: Interaction[] | string[];
    createdAt: Date | string;
    updatedAt: Date | string;
}
