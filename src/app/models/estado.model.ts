import { Regiao } from "./regiao.model";

export class Estado {
    id!: number;
    nome!: string;
    sigla!: string;
    idRegiao?: number;
    regiao?: Regiao;
}
