import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { STORAGE_KEYS } from 'src/app/@core/constants';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
    public tipoSenha: string = 'password';
    public loginForm: FormGroup;
    public isSubmitted: boolean = false;
    public loginFailed: boolean = false;

    constructor(private router: Router, private http: HttpClient) {

    }

    ngOnInit(): void {
        this.loginForm = new FormGroup(
            {
                email: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.pattern(
                            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        ),
                        Validators.maxLength(60)
                    ]
                ),
                senha: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.minLength(4),
                    ],
                )
            }
        )
    }

    entrar(): void {
        if (this.loginForm.invalid) {
            return;
        }
        this.isSubmitted = true;
        const formValue = this.loginForm.value;
        this.http.post('/usuarios/auth', formValue).subscribe((data: any) => {
            this.isSubmitted = false;
            localStorage.setItem(STORAGE_KEYS.AUTH, data.jwtToken);
            delete data.jwtToken;
            localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(data));
            this.router.navigate(['/funcionarios']);
        }, (error: any) => {
            console.log(error);
            if (error.status == 404 || error.status == 400) {
                this.loginFailed = true;
            }
            this.isSubmitted = false;
        });
    }

    changeTipoSenha(): void {
        this.tipoSenha = this.tipoSenha === 'password' ? 'text' : 'password';
    }

}