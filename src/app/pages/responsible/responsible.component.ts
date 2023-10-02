import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResponsibleModel } from 'src/app/core/models/responsible-model';
import { ApiService } from 'src/app/core/services/api.service';
import { ResponsibleModalComponent } from '../responsible-modal/responsible-modal.component';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';

@Component({
  selector: 'app-responsible',
  templateUrl: './responsible.component.html',
  styleUrls: ['./responsible.component.scss']
})
export class ResponsibleComponent implements OnInit {
  responsibles: ResponsibleModel[] = [];
  displayedColumns: string[] = ['name', 'document_id', 'company_name', 'action'];
  dataSource = new MatTableDataSource<ResponsibleModel>();
  
  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  constructor(private dialog: MatDialog, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getAllResponsible();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
      } 
    });
  }

  openEditResponsible(data: any){
    let dialogRef = this.dialog.open(ResponsibleModalComponent,{
      data: data,
      backdropClass: 'bdc',
      panelClass: 'modal-bg',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response === 'success'){
        this.getAllResponsible();
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
          this.dataSource.data = this.responsibles;
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

  deleteResponsible(values: any){
    globalAlert({
      title: 'Importante',
      text: '¿Esta seguro de que desea eliminar la Compañia?',
      icon: 'warning',
      cancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if(resp.isConfirmed){
        let dialogRef = globalLoading(this.dialog);
        let data: any = {
          id: values.id
        }
        this.apiService.call(data, 'deleteResponsible', 'POST', true).subscribe({
          next: (response) => {
            if(response.status === 'SUCCESS'){
              dialogRef.close();
              globalAlert({
                title: 'Transacción Exitosa',
                text: 'Se ha eliminado exitosamente',
                icon: 'success',
              }).then(() => {
                this.getAllResponsible();
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
