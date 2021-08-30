import { Component } from '@angular/core';
import { NivelAcessoEnum } from 'src/app/@core/nivelAcessoEnum';
import { take } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { STORAGE_KEYS } from 'src/app/@core/constants';
import { Funcionario } from 'src/app/@core/Funcionario';
import { environment } from 'src/environments/environment';
import { OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-cadastro-funcionario',
    templateUrl: './cadastro.component.html',
    styleUrls: ['./cadastro.component.scss'],
})

export class CadastroFuncionarioComponent implements OnDestroy, OnInit {
    public NivelAcessoEnum;
    profileMode: 'profile' | 'cadastro' | 'edit' = 'profile';
    funcionarioEditId: number = null;
    cadastroForm: FormGroup;
    isSubmitted: boolean = false;
    funcionario: Funcionario;
    nivelAcessoUsuarioLogado: NivelAcessoEnum;

    private routerSubscription: Subscription;
    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private snackBar: MatSnackBar) {
        this.NivelAcessoEnum = NivelAcessoEnum
        this.funcionario = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO));
        this.nivelAcessoUsuarioLogado = this.funcionario.nivelAcesso;
        this.routerEvents();
        this.loadPage();
    }
    ngOnInit(): void {
        this.buildForm();
    }
    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }

    loadPage() {
        this.route.params.pipe(take(1)).subscribe(params => {
            const profile: string = params['profile'];
            if (profile.match('profile')) {
                this.profileMode = 'profile';
            } else if (parseInt(profile)) {
                this.funcionarioEditId = parseInt(profile);
                this.profileMode = 'edit';
            } else {
                this.profileMode = 'cadastro'
            }
        })

        switch (this.profileMode) {
            case 'profile':
                this.loadProfile();
                break;

            case 'cadastro':
                break;

            case 'edit':
                this.loadEditFuncionario();
                break;
            default:
                break;
        }
    }

    loadProfile() {
        let funcionario: Funcionario = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO))
        let auth: string = localStorage.getItem(STORAGE_KEYS.AUTH);
        this.http.get(`${environment.apiUrl}/usuario/${funcionario.id}`, { headers: { 'Authorization': 'Bearer ' + auth } }).subscribe((data: any) => {
            console.log(data);
            this.funcionario = data;
            this.cadastroForm.setValue(data);
        }, error => {
            console.log(error);
        })
    }

    loadEditFuncionario() {
        let auth: string = localStorage.getItem(STORAGE_KEYS.AUTH);
        this.http.get(`${environment.apiUrl}/usuario/${this.funcionarioEditId}`, { headers: { 'Authorization': 'Bearer ' + auth } }).subscribe((data: any) => {
            console.log(data);
            this.funcionario = data;
            this.cadastroForm.setValue(data);
        }, error => {
            console.log(error);
            let snackBarRef = this.snackBar.open(error.error);
        })
    }

    submitEditFuncionario() {
        let auth: string = localStorage.getItem(STORAGE_KEYS.AUTH);
        this.http.put(`${environment.apiUrl}/usuario/${this.funcionarioEditId}`, this.cadastroForm.value, { headers: { 'Authorization': 'Bearer ' + auth } }).subscribe((data: any) => {
            console.log(data);
            this.isSubmitted = false;
            let snackBarRef = this.snackBar.open('Cadastro Atualizado!', null, { duration: 3000 });
        }, error => {
            console.log(error);
            this.isSubmitted = false;
            if (error.status == 400) {
                let snackBarRef = this.snackBar.open(error.error);
            }
        })
    }

    submitProfile() {
        let funcionario: Funcionario = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO))
        let auth: string = localStorage.getItem(STORAGE_KEYS.AUTH);
        this.http.put(`${environment.apiUrl}/usuario/${funcionario.id}`, this.cadastroForm.value, { headers: { 'Authorization': 'Bearer ' + auth } }).subscribe((data: any) => {
            console.log(data);
            this.isSubmitted = false;
            let snackBarRef = this.snackBar.open('Cadastro Atualizado!', null, { duration: 3000 });
        }, error => {
            console.log(error);
            this.isSubmitted = false;
            if (error.status == 400) {
                let snackBarRef = this.snackBar.open(error.error);
            }
        })
    }

    submitCadastro() {
        let auth: string = localStorage.getItem(STORAGE_KEYS.AUTH);
        this.http.post(`${environment.apiUrl}/usuario`, this.cadastroForm.value, { headers: { 'Authorization': 'Bearer ' + auth } }).subscribe((data: any) => {
            console.log(data);
            this.isSubmitted = false;
            let snackBarRef = this.snackBar.open('Funcionário Cadastrado!', null, { duration: 3000 });
            this.cadastroForm.reset();
            this.cadastroForm.clearValidators();
            this.cadastroForm.markAsUntouched();
            this.cadastroForm.updateValueAndValidity();
            this.cadastroForm.markAsPristine();
        }, error => {
            console.log(error);
            if (error.status == 400) {
                let snackBarRef = this.snackBar.open(error.error);
            }
            this.isSubmitted = false;
        })
    }

    submitForm() {
        console.log('submitForm', this.cadastroForm.value);
        if (this.cadastroForm.invalid) {
            return;
        }
        this.isSubmitted = true;

        switch (this.profileMode) {
            case 'profile':
                this.submitProfile();
                break;

            case 'cadastro':
                this.submitCadastro();
                break;

            case 'edit':
                this.submitEditFuncionario();
                break;
            default:
                break;
        }
    }

    routerEvents() {
        this.routerSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.loadPage();
            }
        });
    }

    buildForm() {
        this.cadastroForm = new FormGroup(
            {
                nome: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(30)
                    ]
                ),
                sobrenome: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(50)
                    ]
                ),
                pis: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.minLength(11),
                        Validators.maxLength(11)
                    ]
                ),
                nivelAcesso: new FormControl(
                    NivelAcessoEnum.NORMAL,
                    [
                        Validators.required,
                    ]
                ),
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
                id: new FormControl(
                    null
                ),
                dataCadastro: new FormControl(
                    null
                ),
                dataAtualizacao: new FormControl(
                    null
                ),
            }
        )
    }
}