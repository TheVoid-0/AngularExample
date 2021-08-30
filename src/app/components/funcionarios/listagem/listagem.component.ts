import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Funcionario } from '../../../@core/Funcionario';
import { NivelAcessoEnum } from 'src/app/@core/nivelAcessoEnum';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PesquisaDialogComponent } from '../../shared/pesquisa-dialog/pesquisa-dialog.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { STORAGE_KEYS } from 'src/app/@core/constants';
import { PageEvent } from '@angular/material/paginator';
import { DateUtil, stringfyObjectValues } from 'src/app/@core/util';


enum Order {
    ASC = 'ASC', DESC = 'DESC'
}


@Component({
    selector: 'app-listagem-funcionario',
    templateUrl: './listagem.component.html',
    styleUrls: ['./listagem.component.scss'],
})
export class ListagemFuncionarioComponent implements OnInit {

    colunas: string[] = ['nome', 'sobrenome', 'email', 'pis', 'dataCadastro', 'editar', 'deletar'];
    resultsLength: number = 0;
    orderField: string = 'nome';
    orderDirection: string = '';
    isLoading: boolean = false;
    currentPage: string = '0';
    funcionarios: Funcionario[] = [
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            dataCadastro: '29/08/2021',
            nivelAcesso: NivelAcessoEnum.ADMIN
        },
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            dataCadastro: '29/08/2021',
            nivelAcesso: NivelAcessoEnum.ADMIN
        },
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            dataCadastro: '29/08/2021',
            nivelAcesso: NivelAcessoEnum.ADMIN
        },
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            dataCadastro: '29/08/2021',
            nivelAcesso: NivelAcessoEnum.ADMIN
        },
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            dataCadastro: '29/08/2021',
            nivelAcesso: NivelAcessoEnum.ADMIN
        },
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            dataCadastro: '29/08/2021',
            nivelAcesso: NivelAcessoEnum.ADMIN
        },
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            dataCadastro: '29/08/2021',
            nivelAcesso: NivelAcessoEnum.ADMIN
        },
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            dataCadastro: '29/08/2021',
            nivelAcesso: NivelAcessoEnum.ADMIN
        },
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            dataCadastro: '29/08/2021',
            nivelAcesso: NivelAcessoEnum.ADMIN
        },
        {
            id: 1,
            nome: 'Marco',
            sobrenome: 'Moura',
            email: 'marcodnmoura@gmail.com',
            pis: '12345648',
            dataCadastro: '29/08/2021',
            nivelAcesso: NivelAcessoEnum.ADMIN
        },
    ];

    // objeto do funcionário usado no dialog de pesquisa
    funcionarioPesquisa: Funcionario = {
        id: 0,
        nome: '',
        sobrenome: '',
        email: '',
        pis: '',
        dataCadastro: '',
        nivelAcesso: NivelAcessoEnum.NORMAL
    }


    constructor(private router: Router, public dialog: MatDialog, private http: HttpClient) {

    }
    ngOnInit(): void {
        this.isLoading = true;
        this.filtrarFuncionarios();
    }

    private filtrarFuncionarios() {
        let orderDirectionFIlter = null;
        if (this.orderDirection) {
            switch (this.orderDirection) {
                case 'asc': {
                    orderDirectionFIlter = Order.ASC;
                    break;
                }
                case 'desc': {
                    orderDirectionFIlter = Order.DESC;
                    break;
                }
            }
        }
        this.http.get(environment.apiUrl + '/usuario', {
            params: {
                ...stringfyObjectValues(this.funcionarioPesquisa),
                page: this.currentPage,
                orderDirection: orderDirectionFIlter,
                orderField: this.orderField
            },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH)}`
            }
        }).subscribe((data: any) => {
            this.isLoading = false;
            console.log(data);
            this.mapFuncionarios(data.content);
            this.resultsLength = this.funcionarios.length

            console.log(this.funcionarios)
        }, error => {
            console.log(error);
            this.isLoading = false;
        })
    }
    // validar onde e qual ícone de ordenação será exibido
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

    private mapFuncionarios(funcionarios: Funcionario[]) {
        this.funcionarios = funcionarios.map(funcionario => {
            let { dataCadastro, ...rest } = funcionario
            return {
                ...rest,
                dataCadastro: DateUtil.formatDate(dataCadastro)
            }
        })
    }

    // alterar a ordenação
    changeOrder(field) {
        let lastOrderDirection = this.orderDirection;
        let lastOrderField = this.orderField;
        // se o campo for o mesmo que já está ordenando então somente altera a direção
        if (this.orderField == field) {
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
        if (lastOrderDirection != this.orderDirection || lastOrderField != this.orderField) {
            this.filtrarFuncionarios();
        }
    }

    // pesquisa
    openPesquisaDialog(): void {
        const dialogRef = this.dialog.open(PesquisaDialogComponent, {
            width: '250px',
            data: this.funcionarioPesquisa
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
            this.funcionarioPesquisa = result;
            this.funcionarioPesquisa.dataCadastro = DateUtil.formatDateToISO(this.funcionarioPesquisa.dataCadastro);
            this.filtrarFuncionarios();
        });
    }

    pageListener(event: PageEvent) {
        console.log('pageListener', event)
        this.currentPage = event.pageIndex.toString()
    }
}