import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';

@Component({
  selector: 'app-floor-modal',
  templateUrl: './floor-modal.component.html',
  styleUrls: ['./floor-modal.component.scss']
})
export class FloorModalComponent implements OnInit {

  isAdd: boolean = false;

  floorForm = new FormGroup({
    floor: new FormControl('', [Validators.minLength(5)]),
  })

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FloorModalComponent>,
  ) { }

  ngOnInit(): void {
    if(this.data !== null){
      this.isAdd = false;
      this.floorForm.controls.floor.setValue(this.data.floor)
    } else {
      this.isAdd = true;
    }
  }

  saveFloor(values: any){
    let dialogRef = globalLoading(this.dialog);
    let data: any = {
      floor: values.floor,
    }
    let route = '';
    if(this.isAdd){
      route = 'createFloor';
    } else {
      route = 'updateFloor';
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
