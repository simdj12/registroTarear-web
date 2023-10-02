import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CompanyModel } from 'src/app/core/models/company-model';
import { ApiService } from 'src/app/core/services/api.service';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';
import { CompanyModalComponent } from '../company-modal/company-modal.component';

@Component({
  selector: 'app-responsible-modal',
  templateUrl: './responsible-modal.component.html',
  styleUrls: ['./responsible-modal.component.scss']
})
export class ResponsibleModalComponent implements OnInit {
  isAdd: boolean = false;
  companies: CompanyModel[] = [];

  responsibleForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(5)]),
    id_company: new FormControl('', [Validators.required]),
    document_id: new FormControl('', [Validators.minLength(5)]),
  })

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ResponsibleModalComponent>,
  ) { }

  ngOnInit(): void {
    if(this.data !== null){
      this.isAdd = false;
    } else {
      this.isAdd = true;
    }
    this.getAllCompany();
  }

  saveResponsible(values: any){
    let dialogRef = globalLoading(this.dialog);
    let data: any = {
      name: values.name,
      id_company: values.id_company,
      document_id: values.document_id,
    }
    let route = '';
    if(this.isAdd){
      route = 'createResponsible';
    } else {
      route = 'updateResponsible';
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
              contact_phone: company.contact_phone
            })
          });
          if(!this.isAdd){
            console.log(this.data);
            this.responsibleForm.controls.name.setValue(this.data.name);
            this.responsibleForm.controls.id_company.setValue(this.data.company.id);
            this.responsibleForm.controls.document_id.setValue(this.data.document_id);
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
      } else if(response === 'logout'){
        this.dialogRef.close();
      } 
    });
  }

}
