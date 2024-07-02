import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('ACCESS_TOKEN');
    if(token){
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('Token added to request:', cloned.headers.get('Authorization')); // Log di debug
      return next.handle(cloned);
    } else {
      console.log('No token found in localStorage'); // Log di debug
      return next.handle(req);
    }
  }
}
