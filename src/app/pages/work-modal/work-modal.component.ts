import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponsibleModel } from 'src/app/core/models/responsible-model';
import { StateWorkModel } from 'src/app/core/models/state-work-model';
import { TypeWorkModel } from 'src/app/core/models/type-work-model';
import { WorkModel } from 'src/app/core/models/work-model';
import { ApiService } from 'src/app/core/services/api.service';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';
import { TypeWorkModalComponent } from '../type-work-modal/type-work-modal.component';
import { StateWorkModalComponent } from '../state-work-modal/state-work-modal.component';
import { ResponsibleModalComponent } from '../responsible-modal/responsible-modal.component';
import { EquipmentFacilitiesModel } from 'src/app/core/models/equipment-facilities-model';
import { EquipmentFacilitiesModalComponent } from '../equipment-facilities-modal/equipment-facilities-modal.component';

@Component({
  selector: 'app-work-modal',
  templateUrl: './work-modal.component.html',
  styleUrls: ['./work-modal.component.scss']
})
export class WorkModalComponent implements OnInit {
  firstTime: boolean = true;
  isAdd: boolean = false;
  type_works: TypeWorkModel[] = [];
  state_works: StateWorkModel[] = [];
  responsibles: ResponsibleModel[] = [];
  equipment_facilities: EquipmentFacilitiesModel[] = [];

  workForm = new FormGroup({
    id_type_work: new FormControl('', [Validators.required]),
    id_state_work: new FormControl('', [Validators.required]),
    id_equipment_facilities: new FormControl('', [Validators.required]),
    id_responsible: new FormControl('', [Validators.required]),
    start_date: new FormControl('', [Validators.required]),
    end_date: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(5)]),
  })

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<WorkModalComponent>,
  ) { }

  ngOnInit(): void {
    if(this.data !== null){
      this.isAdd = false;
      this.workForm.controls.start_date.setValue(this.data.start_date);
      this.workForm.controls.end_date.setValue(this.data.end_date);
      this.workForm.controls.description.setValue(this.data.description);
    } else {
      this.isAdd = true;
    }
    this.getAllTypeWork();
  }

  saveWork(values: any){
    let dialogRef = globalLoading(this.dialog);
    let data: any = {
      id_type_work: values.id_type_work,
      id_state_work: values.id_state_work,
      id_equipment_facilities:values.id_equipment_facilities,
      id_responsible: values.id_responsible,
      start_date: values.start_date,
      end_date: values.end_date,
      description: values.description,
    }
    let route = '';
    if(this.isAdd){
      route = 'createWork';
    } else {
      route = 'updateWork';
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
            this.dialogRef.close();
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

  getAllTypeWork(){
    let dialogRef = globalLoading(this.dialog);
    this.apiService.call(null, 'getAllTypeWork', 'GET', true).subscribe({
      next: (response) => {
        if(response.status === 'SUCCESS'){
          this.type_works = [];
          response.data.map((type_work: TypeWorkModel) => {
            this.type_works.push(type_work);
          });
          if(this.firstTime){
            if(!this.isAdd){
              this.workForm.controls.id_type_work.setValue(this.data.type_work.id);
            }
            this.getAllStateWork();
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
            this.dialogRef.close();
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

  getAllStateWork(){
    let dialogRef = globalLoading(this.dialog);
    this.apiService.call(null, 'getAllStateWork', 'GET', true).subscribe({
      next: (response) => {
        if(response.status === 'SUCCESS'){
          this.state_works = [];
          response.data.map((state_work: StateWorkModel) => {
            this.state_works.push(state_work);
          });
          if(this.firstTime){
            if(!this.isAdd){
              this.workForm.controls.id_state_work.setValue(this.data.state_work.id);
            }
            this.getAllEquipmentFacilities();
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
            this.dialogRef.close();
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

  getAllEquipmentFacilities(){
    let dialogRef = globalLoading(this.dialog);
    this.apiService.call(null, 'getAllEquipmentFacilities', 'GET', true).subscribe({
      next: (response) => {
        if(response.status === 'SUCCESS'){
          this.equipment_facilities = [];
          response.data.map((equipment_facility: EquipmentFacilitiesModel) => {
            this.equipment_facilities.push(equipment_facility);
          });
          if(this.firstTime){
            if(!this.isAdd){
              this.workForm.controls.id_equipment_facilities.setValue(this.data.equipment_facility.id);
            }
            this.getAllResponsible();
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
            this.dialogRef.close();
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

  getAllResponsible(){
    let dialogRef = globalLoading(this.dialog);
    this.apiService.call(null, 'getAllResponsible', 'GET', true).subscribe({
      next: (response) => {
        if(response.status === 'SUCCESS'){
          this.responsibles = [];
          response.data.map((responsible: ResponsibleModel) => {
            this.responsibles.push(responsible);
          });
          if(!this.isAdd && this.firstTime){
            this.workForm.controls.id_responsible.setValue(this.data.responsible.id);
            this.firstTime = false;
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
            this.dialogRef.close();
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

  openAddTypeWork(){
    let dialogRef = this.dialog.open(TypeWorkModalComponent,{
      backdropClass: 'bdc',
      panelClass: 'modal-bg',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response === 'success'){
        this.getAllTypeWork();
      } else if(response === 'logout'){
        this.dialogRef.close();
      }
    });
  }

  openAddStateWork(){
    let dialogRef = this.dialog.open(StateWorkModalComponent,{
      backdropClass: 'bdc',
      panelClass: 'modal-bg',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response === 'success'){
        this.getAllStateWork();
      } else if(response === 'logout'){
        this.dialogRef.close();
      }
    });
  }

  openAddResponsible(){
    let dialogRef = this.dialog.open(ResponsibleModalComponent,{
      backdropClass: 'bdc',
      panelClass: 'modal-bg',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response === 'success'){
        this.getAllResponsible();
      } else if(response === 'logout'){
        this.dialogRef.close();
      } 
    });
  }

  openAddEquipmentFacilities(){
    let dialogRef = this.dialog.open(EquipmentFacilitiesModalComponent,{
      backdropClass: 'bdc',
      panelClass: 'modal-bg',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response === 'success'){
        this.getAllEquipmentFacilities();
      } else if(response === 'logout'){
        this.dialogRef.close();
      } 
    });
  }
}
