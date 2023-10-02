import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EquipmentFacilitiesModel } from 'src/app/core/models/equipment-facilities-model';
import { ApiService } from 'src/app/core/services/api.service';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';
import { EquipmentFacilitiesModalComponent } from '../equipment-facilities-modal/equipment-facilities-modal.component';

@Component({
  selector: 'app-equipment-facilities',
  templateUrl: './equipment-facilities.component.html',
  styleUrls: ['./equipment-facilities.component.scss']
})
export class EquipmentFacilitiesComponent implements OnInit {
  equipmentFacilities: EquipmentFacilitiesModel[] = [];
  displayedColumns: string[] = ['name', 'description', 'action'];
  dataSource = new MatTableDataSource<EquipmentFacilitiesModel>();
  
  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  constructor(private dialog: MatDialog, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getAllEquipmentFacilities();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
      } 
    });
  }

  openEditEquipmentFacilities(data: any){
    let dialogRef = this.dialog.open(EquipmentFacilitiesModalComponent,{
      data: data,
      backdropClass: 'bdc',
      panelClass: 'modal-bg',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response === 'success'){
        this.getAllEquipmentFacilities();
      } 
    })
  }

  getAllEquipmentFacilities(){
    let dialogRef = globalLoading(this.dialog);
    this.apiService.call(null, 'getAllEquipmentFacilities', 'GET', true).subscribe({
      next: (response) => {
        if(response.status === 'SUCCESS'){
          this.equipmentFacilities = [];
          response.data.map((equipmentFacility: EquipmentFacilitiesModel) => {
            this.equipmentFacilities.push(equipmentFacility);
          });
          this.dataSource.data = this.equipmentFacilities;
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
          }).then(() => this.apiService.logout());
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

  deleteEquipmentFacilities(values: any){
    globalAlert({
      title: 'Importante',
      text: '¿Esta seguro de que desea eliminar el Equipamiento e Instalación?',
      icon: 'warning',
      cancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if(resp.isConfirmed){
        let dialogRef = globalLoading(this.dialog);
        let data: any = {
          id: values.id
        }
        this.apiService.call(data, 'deleteEquipmentFacilities', 'POST', true).subscribe({
          next: (response) => {
            if(response.status === 'SUCCESS'){
              dialogRef.close();
              globalAlert({
                title: 'Transacción Exitosa',
                text: 'Se ha eliminado exitosamente',
                icon: 'success',
              }).then(() => {
                this.getAllEquipmentFacilities();
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
              }).then(() => this.apiService.logout());
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
    });
  }
}
