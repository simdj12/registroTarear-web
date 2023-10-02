import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';

@Component({
  selector: 'app-type-work-modal',
  templateUrl: './type-work-modal.component.html',
  styleUrls: ['./type-work-modal.component.scss']
})
export class TypeWorkModalComponent implements OnInit {
  isAdd: boolean = false;

  typeWorkForm = new FormGroup({
    type_work: new FormControl('', [Validators.minLength(5)]),
  })

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TypeWorkModalComponent>,
  ) { }

  ngOnInit(): void {
    if(this.data !== null){
      this.isAdd = false;
      this.typeWorkForm.controls.type_work.setValue(this.data.type_work)
    } else {
      this.isAdd = true;
    }
  }

  saveTypeWork(values: any){
    let dialogRef = globalLoading(this.dialog);
    let data: any = {
      type_work: values.type_work,
    }
    let route = '';
    if(this.isAdd){
      route = 'createTypeWork';
    } else {
      route = 'updateTypeWork';
      data.id = this.data.id;
    }
    this.apiService.call(data, route, 'POST', true).subscribe({
      next: (response) => {
        if(response.status === 'SUCCESS'){
          dialogRef.close();
          globalAlert({
            title: 'Transacción Exitosa',
            text: 'Se ha guardado exitosamente',
            icon: 'success',
          }).then(() => {
            this.dialogRef.close('success');
          })
        } else {
          dialogRef.close();
          globalAlert({
            title: 'Error',
            text: 'Disculpe, ha ocurrido un error con el servicio',
            icon: 'error',
          })
        }
      },
      error: (error) => {
        dialogRef.close();
        if(error.error.msg === 'Full authentication is required'){
          globalAlert({
            title: 'Error',
            text: 'Disculpe, su sesión ha expirado.',
            icon: 'error',
          }).then(() => {
            this.dialogRef.close('logout');
            this.apiService.logout();
          });
        } else {
          globalAlert({
            title: 'Error',
            text: 'Disculpe, la plataforma no se encuentra disponible',
            icon: 'error',
          });
        }
      }
    });
  }
}
