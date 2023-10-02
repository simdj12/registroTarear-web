import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';

@Component({
  selector: 'app-company-modal',
  templateUrl: './company-modal.component.html',
  styleUrls: ['./company-modal.component.scss']
})
export class CompanyModalComponent implements OnInit {

  isAdd: boolean = false;

  companyForm = new FormGroup({
    company_name: new FormControl('', [Validators.minLength(5)]),
    contact_phone: new FormControl('', [Validators.minLength(5)]),
  })

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CompanyModalComponent>,
  ) { }

  ngOnInit(): void {
    if(this.data !== null){
      this.isAdd = false;
      this.companyForm.controls.company_name.setValue(this.data.company_name);
      this.companyForm.controls.contact_phone.setValue(this.data.contact_phone);
    } else {
      this.isAdd = true;
    }
  }

  saveCompany(values: any){
    let dialogRef = globalLoading(this.dialog);
    let data: any = {
      company_name: values.company_name,
      contact_phone: values.contact_phone,
    }
    let route = '';
    if(this.isAdd){
      route = 'createCompany';
    } else {
      route = 'updateCompany';
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
