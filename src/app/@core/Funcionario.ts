import { NivelAcessoEnum } from "./nivelAcessoEnum";

export class Funcionario
{
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    pis: string;
    nivelAcesso: NivelAcessoEnum
}