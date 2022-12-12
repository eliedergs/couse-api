import Literature from './literature';
import Notification from './notification';
import Pericope from './pericope';

export default interface User {
    id: string;
    name: string;
    email: string;
    photo: string;
    password?: string;
    bio: string;
    literatures?: Literature[];
    pericopes?: Pericope[];
    notifications?: Notification[];
    createdAt: Date | string;
    updatedAt: Date | string;
}
