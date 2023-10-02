import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyModel } from 'src/app/core/models/company-model';
import { ApiService } from 'src/app/core/services/api.service';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';
import { CompanyModalComponent } from '../company-modal/company-modal.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  companies: CompanyModel[] = [];
  displayedColumns: string[] = ['company_name', 'contact_phone', 'action'];
  dataSource = new MatTableDataSource<CompanyModel>();
  
  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  constructor(private dialog: MatDialog, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getAllCompany();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openAddCompany(){
    let dialogRef = this.dialog.open(CompanyModalComponent,{
      backdropClass: 'bdc',
      panelClass: 'modal-bg',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response === 'success'){
        this.getAllCompany();
      } 
    });
  }

  openEditCompany(data: any){
    let dialogRef = this.dialog.open(CompanyModalComponent,{
      data: data,
      backdropClass: 'bdc',
      panelClass: 'modal-bg',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response === 'success'){
        this.getAllCompany();
      } 
    })
  }

  getAllCompany(){
    let dialogRef = globalLoading(this.dialog);
    this.apiService.call(null, 'getAllCompany', 'GET', true).subscribe({
      next: (response) => {
        if(response.status === 'SUCCESS'){
          this.companies = [];
          response.data.map((company: any) => {
            this.companies.push({
              id: company.id,
              company_name: company.company_name,
              contact_phone: company.contact_phone,
            })
          });
          this.dataSource.data = this.companies;
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

  deleteCompany(values: any){
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
        this.apiService.call(data, 'deleteCompany', 'POST', true).subscribe({
          next: (response) => {
            if(response.status === 'SUCCESS'){
              dialogRef.close();
              globalAlert({
                title: 'Transacción Exitosa',
                text: 'Se ha eliminado exitosamente',
                icon: 'success',
              }).then(() => {
                this.getAllCompany();
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
