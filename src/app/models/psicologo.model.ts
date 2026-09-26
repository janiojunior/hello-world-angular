import { Telefone } from './telefone.model';

export type PsicologoRequest = {
  nome: string;
  email: string;
  telefones: Telefone[];
  cpf: string;
  dataNascimento: string;
  genero?: string | null;
  endereco?: string | null;
  crp: string;
  especialidade: string;
  bio?: string | null;
  valorConsulta: number;
  duracaoConsulta: number;
  ativo: boolean;
};

export class Psicologo {
  id: number | null = null;
  nome!: string;
  email!: string;
  telefones: Telefone[] = [];
  cpf!: string;
  dataNascimento!: string;
  genero: string | null = null;
  endereco: string | null = null;
  crp: string | null = null;
  especialidade: string | null = null;
  bio: string | null = null;
  valorConsulta: number | null = null;
  duracaoConsulta: number | null = null;
  dataCadastro!: string;
  ativo: boolean | null = null;
}
