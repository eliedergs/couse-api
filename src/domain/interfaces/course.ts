export default interface Course {
    id: string;
    nome: string;
    modelo: CourseModelEnum;
    descricao: string;
    vagas: number | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export enum CourseModelEnum {
    PRESENTIAL = 'presencial',
    ONLINE = 'online',
}
