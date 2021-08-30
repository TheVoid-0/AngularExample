import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { STORAGE_KEYS } from 'src/app/@core/constants';
import { Funcionario } from 'src/app/@core/Funcionario';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent {

    usuario: Funcionario;
    constructor(private router: Router) {
        this.usuario = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO));
        if (!this.usuario) {
            this.sair();
        }
    }

    sair(): void {
        this.router.navigate([''], { replaceUrl: true });
        localStorage.clear();
    }
}