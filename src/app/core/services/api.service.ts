import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Session } from '../models/session-model';
import { Router } from '@angular/router';
import { globalLoading } from 'src/app/shared/global-loading/global-loading.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public modelSession: Session = {
    token: this.getToken(),
  };

  private headers = new HttpHeaders();
  private json: any;
  
  constructor(private httpClient: HttpClient, private router: Router, private dialog: MatDialog) { }

  call(data: any, route: any, method: any, status: boolean): Observable<any> {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');

    switch (method.toUpperCase()) {
      case 'GET':
        if (status === true) {
          this.headers = this.headers.set('Authorization', '' + this.modelSession.token);
          return this.httpClient.get(environment.apiUrl + route, { headers: this.headers });
        } else {
          return this.httpClient.get(environment.apiUrl + route, { headers: this.headers });
        }
      case 'POST':
        if (data != null) {
          if (status === true) {
            this.headers = this.headers.set('Authorization', '' + this.modelSession.token);
            this.json = JSON.stringify(data);
            return this.httpClient.post(environment.apiUrl + route, this.json, { headers: this.headers });
          } else {
            this.json = JSON.stringify(data);
            return this.httpClient.post(environment.apiUrl + route, this.json, { headers: this.headers });
          }
        } else {
          if (status === true) {
            this.headers = this.headers.set('Authorization', '' + this.modelSession.token);
            this.json = {};
            return this.httpClient.post(environment.apiUrl + route, this.json, { headers: this.headers });
          } else {
            this.json = {};
            return this.httpClient.post(environment.apiUrl + route, this.json, { headers: this.headers });
          }
        }
      default:
        return this.httpClient.get(environment.apiUrl);
    }
  }

  logout(){
    let dialogRef = globalLoading(this.dialog);
    setTimeout(() => {
      this.setToken('');
      this.setModelSesionInSession(this.modelSession);
      this.router.navigate(['login']);
      dialogRef.close();
    }, 5000);
  }

  setModelSesionInSession(modelSession: Session) {
    sessionStorage.setItem('modelSession', JSON.stringify(modelSession));
  }

  setToken(token: string) { this.modelSession.token = token }

  getModelSesion() {
    return sessionStorage.getItem('modelSession') === null ? null : JSON.parse(sessionStorage.getItem('modelSession') || '{}')
  }

  getToken() { return this.getModelSesion() === null || this.getModelSesion() === undefined ? null : this.getModelSesion().token }
}
