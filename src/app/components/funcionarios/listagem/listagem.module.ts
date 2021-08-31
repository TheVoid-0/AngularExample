import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import {ListagemFuncionarioComponent} from './listagem.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
    imports: [
        CommonModule, 
        SharedModule,
        RouterModule.forChild([{ path: '', component: ListagemFuncionarioComponent }]),
        MatSnackBarModule
    ],
    declarations: [ListagemFuncionarioComponent]
})
export class ListagemFuncionarioModule { }