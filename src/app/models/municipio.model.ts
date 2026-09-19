import { Estado } from './estado.model';

export class Municipio {
    id!: number;
    nome!: string;
    idEstado?: number;
    estado?: Estado;
}