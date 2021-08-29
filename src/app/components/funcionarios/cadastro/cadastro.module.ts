import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { CadastroFuncionarioComponent } from './cadastro.component';

@NgModule({
    imports: [
        CommonModule, 
        SharedModule,
        RouterModule.forChild([{ path: '', component: CadastroFuncionarioComponent }]),
    ],
    declarations: [CadastroFuncionarioComponent]
})
export class CadastroFuncionarioModule { }