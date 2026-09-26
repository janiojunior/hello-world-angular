import { Telefone } from './telefone.model';

export type PacienteRequest = {
  nome: string;
  email: string;
  telefones: Telefone[];
  cpf: string;
  dataNascimento: string;
  genero?: string | null;
  endereco?: string | null;
  observacoes?: string | null;
  ativo: boolean;
};

export class Paciente {
  id: number | null = null;
  nome!: string;
  email!: string;
  telefones: Telefone[] = [];
  cpf!: string;
  dataNascimento!: string;
  genero: string | null = null;
  endereco: string | null = null;
  observacoes: string | null = null;
  dataCadastro!: string;
  ativo: boolean | null = null;
}
