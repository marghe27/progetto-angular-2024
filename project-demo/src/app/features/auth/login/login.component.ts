import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authentication } from 'src/app/core/models/authentication';
import { AuthenticationResponse } from 'src/app/core/models/authentication-response-model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;

  /** 
  * Validation Form 
  * Password with two uppercase letters, one special case letter, two digits, three lowercase letters,
  * length 8. The sequence must be respected (//AA#99aaa) 
 */

  constructor(
    private readonly router: Router, 
    private authService: AuthenticationService, 
    private fb: FormBuilder)
  {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      ],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$'
        ),
      ],
      ]
    });

  }



  ngOnInit(): void {}

/** Login method */
   login(){
    console.log('Login method called');
    if(this.loginForm.valid){
      const {email, password} = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response: AuthenticationResponse) => {
          if (response.token){
            localStorage.setItem('ACCESS_TOKEN', response.token); 
            this.router.navigate(['/home']).then(navigationSuccess => 
              navigationSuccess ? console.log('Navigated to home') : console.error('Navigation to home failed!')
            );
          } else {
            console.log(" Sei entrato nell' else ")
            alert("Inserisci username e password corretti!");
          }
        },
        error: (err) => {
          console.log("login err "+ err);
          alert('Login failed');
        }
      });  
    }
  }
 

  /** Temporaneo */
  goToRegister() {
    console.log('Navigating to signup'); // Messaggio di debug
    this.router.navigate(['/signup']);
  }


 
}
  