import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
 

  checkSame(name: string) {
    return (control: AbstractControl) => {
      if (!control || !control.parent) {
        return null;
      }

      const confirmPass = control.value;
      const pass = control.parent.get(name)?.value;
      return pass === confirmPass ? null : { notSame: true };
    }
  }

  register(valuesForm: any) {

    let dialogRef = globalLoading(this.dialog);

    let data = {
      username: valuesForm.username.toString().toLowerCase(),
      email:valuesForm.email,
      password: valuesForm.password,
      confirmPassword:valuesForm.confirmPassword
    };
    this.apiService.call(data, 'register', 'POST', false).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          globalAlert({
            title: 'Registro Completado',
            text: response.msg,
            icon: 'success',
          })
          dialogRef.close();
          this.router.navigate(['login']);
        } else if (response.msg == 'Error al registrar usuario') {
          dialogRef.close();
          globalAlert({
            title: 'Error',
            text: response.msg,
            icon: 'error',
          })
        }
      },
      error: (error) => {
        dialogRef.close();
        globalAlert({
          title: 'Error',
          text: 'Disculpe, la plataforma no se encuentra disponible',
          icon: 'error',
        });
      }
    }
    );
  }
  
  checkPasswordValidator(group: FormGroup) {
    
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
  
    if (pass !== '' && pass != null && confirmPass != null && confirmPass !== '') {
      if (pass === confirmPass) {
        if (!group.get('password')?.hasError('pattern')) {
          group.get('password')?.setErrors(null);
        }
        if (!group.get('confirmPassword')?.hasError('pattern')) {
          group.get('confirmPassword')?.setErrors(null);
        }
        if (pass.length < 5) {
          group.get('password')?.setErrors({ minLength: true });
        }
        if (pass.length < 5) {
          group.get('confirmPassword')?.setErrors({ minLength: true });
        }
        if (pass.length > 16) {
          group.get('password')?.setErrors({ maxLength: true });
        }
        if (pass.length > 16) {
          group.get('confirmPassword')?.setErrors({ maxLength: true });
        }
      } else {
        group.get('password')?.setErrors({
          notSame: true
        });
        group.get('confirmPassword')?.setErrors({
          notSame: true
        });
      }
    }
    return null;
  }
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.registerForm =this.fb.group({
      username: new FormControl('', [Validators.minLength(5)]),
      email: new FormControl('', [Validators.minLength(5)]),
      password: new FormControl ('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        this.checkSame('password')
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        this.checkSame('confirmPassword')         
      ]),
    },{ validators: this.checkPasswordValidator })
   }

  ngOnInit(): void {
  }

}
