import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from 'src/app/core/components/nav-bar/nav-bar.component';
import { FooterComponent } from 'src/app/core/components/footer/footer.component';
import { AdminUserService } from 'src/app/core/services/admin-user.service';
import { User } from 'src/app/core/models/user';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-registered-list',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent, 
    FooterComponent,],
  templateUrl: './registered-list.component.html',
  styleUrls: ['./registered-list.component.scss']
})
export class RegisteredListComponent implements OnInit {

  user: User = {
    id: 0,
    name: '',
    surname: '',
    email: '',
    password: ''
  };
  users: User[] = [];

  constructor(
    private authService: AdminUserService,
    private toastService: ToastService
    ) {}

  ngOnInit(): void { 
    this.authService.getAllUsers().subscribe({
        next: (data: User[]) => {
          this.users = data;
        },
        error: (error) => {
          console.error(error);
          alert('An error occurred while fetching user details');
        }
      });

  }

openUpdateModal(user:User){
  this.user = user;
  //inserire il modale
}


openDeleteModal(user:User){}


}
