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

    colunas: string[] = ['nome', 'sobrenome', 'email', 'pis', 'dataCriacao', 'editar', 'deletar'];
    resultsLength: number = 12;
    orderField : string = '';
    orderDirection : string = '';

    funcionarios: Funcionario[] = [
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            dataCriacao: '29/08/2021',
            nivelAcesso: NivelAcessoEnum.ADMIN
        }
    ];

    checkIcon(field) {
        if (field === this.orderField) {
            if (this.orderDirection === 'asc') {
                return 'arrow_downward';
            } else if (this.orderDirection === 'desc') {
                return 'arrow_upward';
            } else {
                return '';
            }
        }
        
    }

    changeOrder(field) {
        // se o campo for o mesmo que já está ordenando então somente altera a direção
        if ( this.orderField == field) {
            if (this.orderDirection === 'asc') {
                this.orderDirection = 'desc';
            } else if (this.orderDirection === 'desc') {
                this.orderDirection = '';
            } else {
                this.orderDirection = 'asc';
            }
        } else {
            this.orderField = field;
            this.orderDirection = 'asc';
        }
    }
}