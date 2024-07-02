import { Component, AfterViewInit} from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}


/** Logout method */
  logout(): void {
    const confirmation = confirm('Confermi il logout?')
    if(confirmation){
      this.authService.logout().subscribe({
        next: () => {
          console.log('User logged out');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error during logout', err);
        }
      });
    }
  }

}






