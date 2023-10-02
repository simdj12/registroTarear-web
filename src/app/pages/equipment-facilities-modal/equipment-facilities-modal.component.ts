import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FloorModel } from 'src/app/core/models/floor-model';
import { ApiService } from 'src/app/core/services/api.service';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';
import { FloorModalComponent } from '../floor-modal/floor-modal.component';

@Component({
  selector: 'app-equipment-facilities-modal',
  templateUrl: './equipment-facilities-modal.component.html',
  styleUrls: ['./equipment-facilities-modal.component.scss']
})
export class EquipmentFacilitiesModalComponent implements OnInit {

  isAdd: boolean = false;
  floors: FloorModel[] = [];

  equipmentFacilitiesForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(5)]),
    id_floor: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.minLength(5)]),
  })

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EquipmentFacilitiesModalComponent>,
  ) { }

  ngOnInit(): void {
    if(this.data !== null){
      this.isAdd = false;
    } else {
      this.isAdd = true;
    }
    this.getAllFloor();
  }

  saveEquipmentFacilities(values: any){
    let dialogRef = globalLoading(this.dialog);
    let data: any = {
      name: values.name,
      id_floor: values.id_floor,
      description: values.description,
    }
    let route = '';
    if(this.isAdd){
      route = 'createEquipmentFacilities';
    } else {
      route = 'updateEquipmentFacilities';
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

  getAllFloor(){
    let dialogRef = globalLoading(this.dialog);
    this.apiService.call(null, 'getAllFloor', 'GET', true).subscribe({
      next: (response) => {
        if(response.status === 'SUCCESS'){
          this.floors = [];
          response.data.map((floor: any) => {
            this.floors.push({
              id: floor.id,
              floor: floor.floor,
            })
          });
          if(!this.isAdd){
            console.log(this.data);
            this.equipmentFacilitiesForm.controls.name.setValue(this.data.name);
            this.equipmentFacilitiesForm.controls.id_floor.setValue(this.data.floor.id);
            this.equipmentFacilitiesForm.controls.description.setValue(this.data.description);
          }
          dialogRef.close();
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
    })
  }

  openAddFloor(){
    let dialogRef = this.dialog.open(FloorModalComponent,{
      backdropClass: 'bdc',
      panelClass: 'modal-bg',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response === 'success'){
        this.getAllFloor();
      } else if(response === 'logout'){
        this.dialogRef.close();
      } 
    });
  }
}
