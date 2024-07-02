import { Injectable } from '@angular/core';
import { Authentication } from '../models/authentication';
import { AuthenticationResponse } from '../models/authentication-response-model';
import { Observable, of, tap, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {User} from '../models/user';

export const ACCESS_TOKEN = 'Access-store';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private authentication?: Authentication;
  /* private authenticResponse?: AuthenticationResponse; */
  private isLoggedIn = false;
/**  add user property to  store user data */
  private user?: User;
 

  private apiUrl = 'http://localhost:3000/usersList'; // URL Json-Server 

  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    

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
      
    }
   }

   /** Login Method */
  login(email:string, password:string): Observable<AuthenticationResponse>{
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
  }



/** Registration Method */
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
       
     }

  

  /* Useful when other components or services need access to the user's authentication information, such as username or login/expiration dates.*/
 getAuthentication(): Authentication | undefined {
    return this.authentication;
   }

  
  isAuthenticated(): boolean {
     return this.isLoggedIn;
  }

    /** Get all users */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

    /** Get User Details */
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
    }

    /** Update User Details */
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
    }

  /** Delete User Account */
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
  }

  /** Logout Method */
  logout(): Observable<void> {
    return new Observable<void>((observer) => {
      
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem('user');
      /* const tokenAfterRemoval = localStorage.getItem(ACCESS_TOKEN);
      console.log('Token after removal:', tokenAfterRemoval);
  
      if (tokenAfterRemoval === null) {
        console.log('Token successfully removed');
      } else {
        console.warn('Token was not removed, attempting to clear the local storage');
        localStorage.clear();
        console.log('Local storage cleared');
      } */
  
      this.authentication = undefined;
      this.user = undefined;
      this.isLoggedIn = false;
      observer.next();
      observer.complete();
    });
  }
  
}
