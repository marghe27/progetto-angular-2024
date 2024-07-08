import { Injectable } from '@angular/core';
import { Authentication } from '../models/authentication';
import { AuthenticationResponse } from '../models/authentication-response-model';
import { Observable, of, tap, map, switchMap, catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {User} from '../models/user';
/** jwt_decode serve per decodificare, dal token, la email dell'utente loggato, */
import jwt_decode from 'jwt-decode';



export const ACCESS_TOKEN = 'ACCESS_TOKEN';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  /** Questa variabile è collegata al contenuto del constructor, che è commentato  */
  private authentication?: Authentication;
  
  private isLoggedIn = false;
  /**  add user property to  store user data */
  private user?: User;
 
  
  private apiUrl = 'http://localhost:3000/usersList'; // URL Json-Server 

  constructor(private http: HttpClient) {  }
    
  

   /**  nuovo register - 04/07/24 */
   register(
    name: string,
    surname: string,
    email: string,
    password: string
    ): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, { name, surname, email, password }).pipe(
      tap(response => {
        localStorage.setItem(ACCESS_TOKEN, response.token);
        const decodedToken: any = jwt_decode(response.token); // Cast jwt_decode come funzione
        console.log('Decoded Token di register:', decodedToken); // Log di debug
        this.authentication = { 
          email: decodedToken.email, 
          name: decodedToken.name, 
          loginDate: new Date(),
          expirationDate: new Date(decodedToken.exp * 1000),
          token: response.token 
        };
        if (response.token) {
          console.log('Registration successful');
        } else {
          console.log('Registration failed');
        }
      }),
      catchError(error => {
        console.error('Registration error', error);
        return throwError(() => error);
      })
    );
  }

  /**  nuovo login - 04/07/24 
   * Ho salvato l'User ID nel localStorage
  */
  login(email: string, password: string): Observable<AuthenticationResponse>  {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        console.log('Login Response:', response); // Log di debug della risposta
        localStorage.setItem(ACCESS_TOKEN, response.token);
        const userId = response.user.id;
        localStorage.setItem('userId', userId.toString());
        const decodedToken: any = jwt_decode(response.token); // Cast jwt_decode come funzione
        console.log('Decoded Token di login:', decodedToken); // Log di debug
        this.authentication = { 
          id: userId,
          email: decodedToken.email, 
          name: decodedToken.name, 
          loginDate: new Date(),
          expirationDate: new Date(decodedToken.exp * 2000),
          token: response.token 
        };
        console.log('Authentication set:', this.authentication); // Log di debug per autenticazione
      }),
      catchError(error => {
        console.error('Login error', error); // Log di debug per errori di login
        return throwError(() => error);
      })
    );
  }
  
/** Nuovo metodo  getAuthentication() - 04/07/24 
 * il metodo cerca di recuperare e decodificare il token di autenticazione per ottenere i dettagli dell'utente.
 * Salva i dettagli dell'utente nella variabile this.authentication e li restituisce. 
*/
  getAuthentication(): Authentication | undefined{
    if (!this.authentication) {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        const decodedToken: any = jwt_decode(token); // Cast jwt_decode come funzione
        console.log('Decoded Token (Get Authentication)', decodedToken); // Log di debug
        
        // Decode the token to get user details, or fetch from an endpoint
        this.authentication = { 
          email: decodedToken.email, 
          name: decodedToken.name, 
          loginDate: new Date(),
          expirationDate: new Date(decodedToken.exp * 2000),
          token
        };
      }
    }
    return this.authentication;
  }


  /** Nuovo metodo  isAuthenticated() - 04/07/24
   * Il metodo verifica se l'utente è autenticato controllando se ci sono dettagli di autenticazione validi
   * e se il token non è scaduto.
   */
  isAuthenticated(): boolean {
    const auth = this.getAuthentication(); // Ll'utente è autenticato?
    /** La const isAuthenticated può anche essere scritta nel seguente modo:
     * const isAuthenticated = (auth !== undefined && new Date() < auth.expirationDate) ? true : false;
     */
    const isAuthenticated = auth !== undefined && new Date() < auth.expirationDate;
    console.log('isAuthenticated:', isAuthenticated); // Log di debug
    return isAuthenticated;
  }

  /** Get all users */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }


/** Nuovo metodo getUserDetails(email: string) */
  getUserDetails(email: string): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
    });
    console.log('Get User Details Headers:', headers); // Log di debug delle intestazioni
    return this.http.get<User>(`${this.apiUrl}/${email}`, { headers });
  }

  /** Nuovo metodo updateUser(user: User) */
  updateUser(user: User): Observable<User> {
    if (!this.authentication) {
      throw new Error('User not authenticated');
    }

    const token = localStorage.getItem(ACCESS_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Update User Headers:', headers); // Log di debug delle intestazioni

    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user, { headers });
  }

  /** Nuovo metodo deleteUser()
   * Utilizza l'User aggiunto come parametro 
   * modificato il 08/07/24 
   */
  deleteUser(user: User): Observable<void> {
    if (!this.authentication) {
      console.error('User not authenticated and not authorized for deletion'); // Log di errore
      throw new Error('User not authenticated or user details are not available');
    }

    const token = localStorage.getItem(ACCESS_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Delete User Headers:', headers); // Log di debug delle intestazioni
    return this.http.delete<void>(`${this.apiUrl}/${user.id}`, { headers }).pipe(
      tap(() => {
        this.logout().subscribe();
      }),
      catchError(error => {
        console.error('Error deleting user', error);
        return throwError(() => error);
      })
    );
  }

    /** Nuovo metodo logout() 
     * Utilizza l'operatore "of" di RxJS, per creare un Observable 
     * che emette un singolo valore e poi completa. "of(void 0)" crea un Observable, che emette undefined e poi completa, 
     * che è equivalente a creare manualmente un Observable che chiama next e complete.
     * Es.: return new Observable<void>((observer) => {
        //
        observer.next();
        observer.complete();
      });
    */
    logout(): Observable<void> {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem('userId');
        this.authentication = undefined;
        return of(void 0);
      
    }



}


