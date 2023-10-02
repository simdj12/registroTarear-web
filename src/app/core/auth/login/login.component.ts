import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';
import { ApiService } from '../../services/api.service';
import { globalAlert } from 'src/app/shared/global-alert/global-alert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  visibility: boolean = true;
  
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.minLength(5)]),
    password: new FormControl('', [Validators.minLength(5)])
  })

  constructor(private dialog: MatDialog, private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
  }

  test(){
    let loadingRef = globalLoading(this.dialog);
    setTimeout(() => {
      this.router.navigate(['home']);
      loadingRef.close();
    }, 500)
  }

  login(valuesForm: any) {

    let dialogRef = globalLoading(this.dialog);

    let data = {
      username: valuesForm.username.toString().toLowerCase(),
      password: valuesForm.password
    };
    this.apiService.call(data, 'login', 'POST', false).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          this.apiService.setToken(response.data.token);
          this.apiService.setModelSesionInSession(this.apiService.modelSession);
          dialogRef.close();
          this.router.navigate(['work']);
        } else if (response.msg == 'Usuario y/o Contraseña inválida') {
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
      // response => {
        // if (response.status === 'SUCCESS') {
        //   this.authService.setToken(response.data);
        //   this.authService.setIdUser(response.user);
        //   this.authService.setProfile(response.profile);
        //   this.authService.setMenu(response.menu);
        //   this.authService.setUsername(data.username);
        //   this.authService.setCommerce(response.commerce);
        //   this.authService.setModelSesionInSession(this.authService.modelSession);
        //   dialogRef.close();
        //   this._router.navigate(['home']);
        // } else if (response.data == 'Usuario y/o contraseña incorrecto') {
        //   dialogRef.close();
        //   globalAlert({
        //     title: 'Error',
        //     text: response.data,
        //     icon: 'error',
        //   })
        // }
      // },
      // error => {
      //   dialogRef.close();
      //   globalAlert({
      //     title: 'Error',
      //     text: 'Disculpe, la plataforma no se encuentra disponible',
      //     icon: 'error',
      //   });
      // }
    );
  }

}
