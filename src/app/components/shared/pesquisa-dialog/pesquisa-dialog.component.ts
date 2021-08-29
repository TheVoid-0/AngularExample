import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Funcionario } from '../../../@core/Funcionario';

@Component({
    selector: 'pesquisa-dialog',
    templateUrl: 'pesquisa-dialog.component.html',
    styleUrls: ['./pesquisa-dialog.component.scss'],
})

export class PesquisaDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<PesquisaDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Funcionario) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}