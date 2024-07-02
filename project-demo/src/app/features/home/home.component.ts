import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component'; 
import { FooterComponent } from '../../core/components/footer/footer.component';
import { EnrollmentComponent} from '../auth/enrollment/enrollment.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    RouterLink,
    RouterModule,
    NavBarComponent, 
    EnrollmentComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  


constructor(
  private readonly ref: ChangeDetectorRef,
  private readonly router: Router,
) {
  
}

ngOnInit(): void {

}




}
