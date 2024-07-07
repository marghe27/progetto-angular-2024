import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject} from '@angular/core';


/** è una funzione che restituisce un booleano, un UrlTree, un Observable o una Promise di questi tipi. */
export const authGuard: CanActivateFn = (
  route:ActivatedRouteSnapshot, 
  state:RouterStateSnapshot) => {

    // Queste sono dependencies injections sostitutive del costruttore
    const authService = inject(AuthenticationService);
    const router = inject(Router);
    
    const isAuthenticated = authService.isAuthenticated();
    console.log('authGuard isAuthenticated:', isAuthenticated); // Log di debug

    if (isAuthenticated) {
      return true;
    } else {
      return router.createUrlTree(['/login']);
    }
};
    


