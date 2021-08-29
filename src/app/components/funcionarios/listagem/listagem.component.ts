import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Funcionario } from '../../../@core/Funcionario';
import { NivelAcessoEnum } from 'src/app/@core/nivelAcessoEnum';

@Component({
    selector: 'app-listagem-funcionario',
    templateUrl: './listagem.component.html',
    styleUrls: ['./listagem.component.scss'],
})

export class ListagemFuncionarioComponent {
    constructor (private router: Router) {

    }

    colunas: string[] = ['nome', 'sobrenome', 'email', 'pis', 'editar', 'deletar'];

    funcionarios: Funcionario[] = [
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            nivelAcesso: NivelAcessoEnum.ADMIN
        }
    ]
}