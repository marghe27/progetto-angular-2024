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
   * Utilizza l'User ID salvato nel localStorage
   */
  deleteUser(): Observable<void> {
    if (!this.authentication|| !this.user) {
      console.error('User not authenticated or user details are not available'); // Log di errore
      throw new Error('User not authenticated or user details are not available');
    }

    const token = localStorage.getItem(ACCESS_TOKEN);
    const userId = Number(localStorage.getItem('userId'));
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Delete User Headers:', headers); // Log di debug delle intestazioni
    return this.http.delete<void>(`${this.apiUrl}/${this.authentication.id}`, { headers }).pipe(
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

/** Il codice seguente stava dentro al costruttore */
    /* const storedToken = localStorage.getItem(ACCESS_TOKEN);

    if(storedToken){
      const storedAuthentication: Authentication = JSON.parse(storedToken);
      const dateNow = new Date(); 
      const expirationDate = new Date(storedAuthentication.expirationDate);
      if (dateNow < expirationDate){
        this.authentication = storedAuthentication;
        this.isLoggedIn = true; 
        // Get user data from local storage, If available
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          this.user = JSON.parse(storedUser);
        }
      } else {
        this.logout();
      } 
    } *//** Fine codice dentro al costruttore */

  /** Login Method collegato al contenuto del constructor */
  /* login(email:string, password:string): Observable<AuthenticationResponse>{
   return this.http.post<AuthenticationResponse>(`${this.apiUrl}/login`, {email, password}).pipe(
    tap(response => {
      if(response.token){
        const loginDate = new Date();
        const expirationDate = new Date(loginDate.getTime() + (60 * 60000)); // 1 ora
        this.authentication = { email, loginDate, expirationDate };
        
        localStorage.setItem(ACCESS_TOKEN, JSON.stringify(this.authentication));
        //console.log('Token set:', localStorage.getItem(ACCESS_TOKEN));
        this.isLoggedIn = true; 

        // Let's get user details to obtain the ID 
        this.getUserDetails(email).subscribe(user => {
          this.user = user;
          localStorage.setItem('user', JSON.stringify(this.user)); // Save user details into local storage
        });
      }
    })); 
  } */

  /** Registration Method  (vecchio)
  register(
    name: string,
    surname: string,
    email: string,
    password: string
    ): Observable<AuthenticationResponse>{
      return this.http.post<AuthenticationResponse>(`${this.apiUrl}/register`, {name, surname, email, password}).pipe(
       tap(response => {
        if (response.token) {
          console.log('Registration successful');
        } else {
          console.log('Registration failed');
        }
       }));
       
     }*/

  /* Vecchio metodo collegato alla variabile in alto commentata "private authentication?: Authentication;" /* Useful when other components or services need access to the user's authentication information, such as username or login/expiration dates.
 getAuthentication(): Authentication | undefined {
    return this.authentication;
   } */

    /** Get User Details (vecchio)
    getUserDetails(email: string): Observable<User> {
      console.log(`Fetching user details for email: ${email}`); // Log per debug
      return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
        tap(users => console.log('Users retrieved:', users)), // Aggiungi un log per i dati restituiti
        map(users =>{
          this.user = users.find(u => u.email === email);  
          if(!this.user){
            throw new Error('User not found');
          }
          console.log(`User found: ${JSON.stringify(this.user)}`); // Log per debug
          return this.user;
        })
      );
    } */

    /** Update User Details  (vecchio)
    updateUserDetails(user: Partial<User>): Observable<User>{
      if(!this.user || !this.user.id){
        throw new Error('User not authenticated');
      }
      const token = localStorage.getItem(ACCESS_TOKEN);
      if(!token){
        throw new Error('Token not found in local storage');
      }
      const parsedToken = JSON.parse(token).token;
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${parsedToken}`
      });
      return this.http.put<User>(`${this.apiUrl}/${user.id}`, user, { headers }).pipe(
        tap(updateUser => {
          this.user = {...this.user, ...updateUser};
          // update the local storage
          localStorage.setItem('user', JSON.stringify(this.user));
        })
      );
    }*/

  /** Delete User Account  (vecchio)
  deleteUserAccount(): Observable<void> {
    if (!this.user || !this.user.id) {
      throw new Error('User not authenticated');
    }

    const token = localStorage.getItem(ACCESS_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<void>(`${this.apiUrl}/${this.user.id}`, {headers}).pipe(
      tap(() => {
        this.logout().subscribe();
      })
    );
  }*/

  /** Logout Method   (vecchio) */
  /* logout(): Observable<void> {
    return new Observable<void>((observer) => {
      
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem('user'); */
      /* const tokenAfterRemoval = localStorage.getItem(ACCESS_TOKEN);
      console.log('Token after removal:', tokenAfterRemoval);
  
      if (tokenAfterRemoval === null) {
        console.log('Token successfully removed');
      } else {
        console.warn('Token was not removed, attempting to clear the local storage');
        localStorage.clear();
        console.log('Local storage cleared');
      } */
  
      /* this.authentication = undefined;
      this.user = undefined;
      this.isLoggedIn = false;
      observer.next();
      observer.complete();
    });
  } */// fine /** Logout Method */
  
/* logout(): Observable<void> {
      return new Observable<void>((observer) => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem('userId');
        this.authentication = undefined;
        observer.next();
        observer.complete();
      });
    } */
