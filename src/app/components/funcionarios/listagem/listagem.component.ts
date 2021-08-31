import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';


enum Order {
    ASC = 'ASC', DESC = 'DESC'
}


@Component({
    selector: 'app-listagem-funcionario',
    templateUrl: './listagem.component.html',
    styleUrls: ['./listagem.component.scss'],
})
export class ListagemFuncionarioComponent implements OnInit {

    resultsLength: number = 0;
    orderField: string = 'nome';
    orderDirection: string = '';
    isLoading: boolean = false;
    currentPage: string = '0';
    funcionarios: Funcionario[] = [];
    funcionarioLogado: Funcionario = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO))
    colunas: string[] = ['nome', 'sobrenome', 'email', 'pis', 'dataCadastro'];
    NivelAcessoEnum = NivelAcessoEnum
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
    @ViewChild(MatTable) table: MatTable<any>;

    constructor(private router: Router, public dialog: MatDialog, private http: HttpClient, private snackBar: MatSnackBar) {

    }
    ngOnInit(): void {
        this.isLoading = true;
        this.filtrarFuncionarios();
        if (this.funcionarioLogado.nivelAcesso == NivelAcessoEnum.ADMIN) {
            this.colunas.push('editar', 'deletar');
        }
    }

    editarFuncionario(element) {
        this.router.navigate(['funcionarios/form/', element.id]);
    }

    deletarFuncionario(element) {
        console.log('deletar', element);
        this.http.delete(`/usuarios/${element.id}`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem(STORAGE_KEYS.AUTH) } }).subscribe((data: any) => {
            let snackBarRef = this.snackBar.open('Funcionário deletado!');
            this.funcionarios.splice(this.funcionarios.indexOf(element), 1);
            this.table.renderRows();
            console.log(this.funcionarios)
            setTimeout(() => {
                snackBarRef.dismiss();
            }, 3000);
        }, error => {
            console.log('error', error);
            let snackBarRef = this.snackBar.open('Ocorreu um erro!');
            setTimeout(() => {
                snackBarRef.dismiss();
            }, 3000);
        })
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
        this.http.get('/usuarios', {
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
            this.resultsLength = data.totalCount;

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
            if (!result) return;
            this.funcionarioPesquisa = result;
            let dateString = DateUtil.formatDateToISO(this.funcionarioPesquisa.dataCadastro);
            this.funcionarioPesquisa.dataCadastro = dateString ? new Date(dateString) : ''
            this.filtrarFuncionarios();
        });
    }

    pageListener(event: PageEvent) {
        console.log('pageListener', event)
        this.currentPage = event.pageIndex.toString()
        this.filtrarFuncionarios();
    }
}