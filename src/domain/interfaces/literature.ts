import { Genre } from '../entities/literature.entity';
import Interaction from './interaction';
import Notification from './notification';
import Pericope from './pericope';
import User from './user';

export default interface Literature {
    id: string;
    title: string;
    genre: Genre;
    maxPericopes: number;
    sizePericope: number;
    user?: User | string;
    pericopes?: Pericope[] | string[];
    interactions?: Interaction[] | string[];
    notifications?: Notification[] | string[];
    createdAt: Date | string;
    updatedAt: Date | string;
}

export enum PericopeType {
    DRAFT = 'draft',
    PREVIEW = 'preview',
    TIMELINE = 'timeline',
    ALL = 'all',
    NONE = 'none',
}
