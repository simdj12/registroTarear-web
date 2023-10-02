import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { WorkModel } from 'src/app/core/models/work-model';
import { ApiService } from 'src/app/core/services/api.service';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';
import { WorkModalComponent } from '../work-modal/work-modal.component';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';
@Component({
  selector: 'app-work-done',
  templateUrl: './work-done.component.html',
  styleUrls: ['./work-done.component.scss']
})
export class WorkDoneComponent implements OnInit {
  works: WorkModel[] = [];
  displayedColumns: string[] = ['type_work', 'state_work', 'equipment_facilities', 'description', 'action'];
  dataSource = new MatTableDataSource<WorkModel>();
  
  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  constructor(private dialog: MatDialog, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getAllWork();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openEditWork(data: any){
    let dialogRef = this.dialog.open(WorkModalComponent,{
      data: data,
      backdropClass: 'bdc',
      panelClass: 'modal-bg',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response === 'success'){
        this.getAllWork();
      } 
    })
  }

  getAllWork(){
    let dialogRef = globalLoading(this.dialog);
    this.apiService.call(null, 'getAllWork', 'GET', true).subscribe({
      next: (response) => {
        if(response.status === 'SUCCESS'){
          this.works = [];
          response.data.map((work: WorkModel) => {
            if(work.state_work.id === 1){
              this.works.push(work)
            }
          });
          this.dataSource.data = this.works;
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

  deleteWork(values: any){
    globalAlert({
      title: 'Importante',
      text: '¿Esta seguro de que desea eliminar el Trabajo?',
      icon: 'warning',
      cancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if(resp.isConfirmed){
        let dialogRef = globalLoading(this.dialog);
        let data: any = {
          id: values.id
        }
        this.apiService.call(data, 'deleteWork', 'POST', true).subscribe({
          next: (response) => {
            if(response.status === 'SUCCESS'){
              dialogRef.close();
              globalAlert({
                title: 'Transacción Exitosa',
                text: 'Se ha eliminado exitosamente',
                icon: 'success',
              }).then(() => {
                this.getAllWork();
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
