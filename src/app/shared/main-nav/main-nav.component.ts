import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { globalAlert } from '../global-alert/global-alert';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

  opened: boolean = true;

  constructor(private router: Router, public apiService: ApiService) { }

  ngOnInit(): void {
  }

  test(){
    this.router.navigate(['login']);
  }

  onSideNav(){
    this.opened = !this.opened;
  }

  goTo(route: string){
    this.router.navigate([route]);
  }

  logout(){
    globalAlert({
      title: 'Importante',
      text: '¿Esta seguro de que desea Cerrar Sesión?',
      icon: 'warning',
      cancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if(resp.isConfirmed){
        this.apiService.logout();
      }
    })
  }
}
