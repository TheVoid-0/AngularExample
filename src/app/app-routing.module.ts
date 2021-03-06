import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'funcionarios/form',
    loadChildren: () => import('./components/funcionarios/cadastro/cadastro.module').then( m => m.CadastroFuncionarioModule)
  },
  {
    path: 'funcionarios',
    loadChildren: () => import('./components/funcionarios/listagem/listagem.module').then( m => m.ListagemFuncionarioModule)
  },
  {
    path: '',
    loadChildren: () => import('./components/login/login.module').then( m => m.LoginPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
