import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.minLength(5)]),
    email: new FormControl('', [Validators.minLength(5)]),
    password: new FormControl('', [Validators.minLength(5)]),
    confirmPassword: new FormControl('', [Validators.minLength(5)]),
  })
  
  constructor() { }

  ngOnInit(): void {
  }

}
