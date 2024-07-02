import { AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; 

import { Router } from '@angular/router';
import { FooterComponent} from '../../../core/components/footer/footer.component';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FooterComponent,
  ],
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnInit, AfterViewInit { 
  public registerForm!: FormGroup;
  public registeredUser: { name: string; surname: string } | null = null;
  
  
  @ViewChild('modal_success', { static: false }) modal!: ElementRef<HTMLDialogElement>;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService:  AuthenticationService,) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
 
  ngAfterViewInit(): void {
    // Now the modal element should be available
    if (this.modal && this.modal.nativeElement) {
      console.log('Modal element is available', this.modal.nativeElement);
    } else {
      console.error('Modal element is not available');
    }
  }

  register(): void {
    if (this.registerForm.valid) {
      const { name, surname, email, password } = this.registerForm.value;
      this.authService.register(name, surname, email, password).subscribe({
        next: (response) => {
          console.log('Registrazione riuscita', response);
          this.registeredUser = { name, surname };
         
          if (this.modal && this.modal.nativeElement) {
            this.modal.nativeElement.showModal();
          } else {
            console.error('Modal element is not available');
          }
    
          this.registerForm.reset();
        },
        error: (error) => {
          console.error('Errore di registrazione', error);
        }
      });
    }
  } 

  /** Modal's method that goes to the login page for accessing  */
  navigateToLogin(): void {
    if (this.modal && this.modal.nativeElement) {
      this.modal.nativeElement.close();
    }
    this.router.navigate(['/login']);
  }

  /** Method of registration module  */
  goToLogin(){
    this.router.navigate(['/login']);
  }

}

