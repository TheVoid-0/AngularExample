import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { CadastroFuncionarioComponent } from './cadastro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: ':profile', component: CadastroFuncionarioComponent }]),
        ReactiveFormsModule,
        MatSnackBarModule
    ],
    declarations: [CadastroFuncionarioComponent]
})
export class CadastroFuncionarioModule { }