import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, ObservableInput } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  private baseUrl = 'http://localhost:3000/usersList'; 
  private user?: User;

  constructor(private http: HttpClient) { }

    /** Get all users */
    getAllUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.baseUrl);
    }

    /** Update user */
    updateUser(user:User):Observable<User>{
      return this.http.put<User>(`${this.baseUrl}/${user.id}`, user);
    }

    /** Deletion user */
    deleteUser(userId:number):Observable<void>{
      return this.http.delete<void>(`${this.baseUrl}/${userId}`);
    }
}




