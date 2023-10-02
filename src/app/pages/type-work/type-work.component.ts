import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/core/services/api.service';
import { TypeWorkModalComponent } from '../type-work-modal/type-work-modal.component';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';
import { TypeWorkModel } from 'src/app/core/models/type-work-model';

@Component({
  selector: 'app-type-work',
  templateUrl: './type-work.component.html',
  styleUrls: ['./type-work.component.scss']
})
export class TypeWorkComponent implements OnInit {
  type_works: TypeWorkModel[] = [];
  displayedColumns: string[] = ['type_work', 'action'];
  dataSource = new MatTableDataSource<TypeWorkModel>();
  
  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  constructor(private dialog: MatDialog, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getAllTypeWork();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
      } 
    });
  }

  openEditTypeWork(data: any){
    let dialogRef = this.dialog.open(TypeWorkModalComponent,{
      data: data,
      backdropClass: 'bdc',
      panelClass: 'modal-bg',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response === 'success'){
        this.getAllTypeWork();
      } 
    })
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
          this.dataSource.data = this.type_works;
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

  deleteTypeWork(values: any){
    globalAlert({
      title: 'Importante',
      text: '¿Esta seguro de que desea eliminar el Tipo de Trabajo?',
      icon: 'warning',
      cancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if(resp.isConfirmed){
        let dialogRef = globalLoading(this.dialog);
        let data: any = {
          id: values.id
        }
        this.apiService.call(data, 'deleteTypeWork', 'POST', true).subscribe({
          next: (response) => {
            if(response.status === 'SUCCESS'){
              dialogRef.close();
              globalAlert({
                title: 'Transacción Exitosa',
                text: 'Se ha eliminado exitosamente',
                icon: 'success',
              }).then(() => {
                this.getAllTypeWork();
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
