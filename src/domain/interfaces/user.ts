export default interface User {
    id: string;
    name: string;
    email: string;
    photo: string;
    password?: string;
    bio: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}
