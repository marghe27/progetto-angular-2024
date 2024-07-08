import { Component, ElementRef, Input, OnInit, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageDialogComponent } from '../../shared/components/message-dialog/message-dialog.component';
import { MOCK_MESSAGES } from '../../core/mocks/mock-messages';
import { NavBarComponent } from 'src/app/core/components/nav-bar/nav-bar.component';
import { FooterComponent } from 'src/app/core/components/footer/footer.component';
import { AuthenticationService } from '../../core/services/authentication.service';
import { User } from '../../core/models/user';


@Component({
  selector: 'app-manage-account',
  standalone: true,
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    NavBarComponent, 
    FooterComponent,
    MessageDialogComponent,
    FormsModule
  ], 
})
export class ManageAccountComponent implements OnInit{

   /*  user: User | undefined; */
    user: User = {
      id: 0,
      name: '',
      surname: '',
      email: '',
      password: ''
    };
    users: User[] = [];

    modalTitle = '';
    modalMessage = '';
    isUpdate = true;
    isDeleteChecked = false;


    @ViewChild('messageDialog')  messageDialog!:MessageDialogComponent;
    

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router, 
    private authService: AuthenticationService
  ) {}

  

  ngOnInit(): void { 
    /* this.loadUsers(); */
    const auth = this.authService.getAuthentication();
    if (auth && auth.email){
      this.authService.getUserDetails(auth.email).subscribe({
        next: (data: User) => {
          this.user = data;
        },
        error: (error) => {
          console.error(error);
          alert('An error occurred while fetching user details');
        }
      });
    }
  }

/* Method to update user */
updateUser(): void{
  if(!this.user){
    console.error('User is undefined');
    alert('User details are not available');
    return;
  }
  console.log('Updating user:', this.user); // Log di debug
  this.authService.updateUser(this.user).subscribe({
    next: (updatedUser: User)=>{
      this.user = updatedUser;
      console.log('User updated successfully:', updatedUser); // Log di debug
      this.messageDialog.closeModal();
    },
    error: (error) => {
      console.error(error);
      alert('An error occurred while updating the user');
    }
  });
}

/** Open modal for updating  item */
openUpdateModal():void{
  const updateMessage = MOCK_MESSAGES.find(m => m.id === 1);
  if(updateMessage){
    this.modalTitle = updateMessage.title;
    this.modalMessage = updateMessage.message;
    this.isUpdate = true;
    if(this.messageDialog){
      this.messageDialog.showModal();
    }
    }
}



deleteUser(): void {
  if (!this.user) {
    console.error('User is undefined');
    alert('User details are not available');
    return;
  }

  this.authService.deleteUser().subscribe({
    next: () => {
      this.router.navigate(['/login']); // Redirect to the login page after the delete
      
      this.messageDialog.closeModal();
    },
    error: (error) => {
      console.error(error);
      alert('An error occurred while deleting the user');
    }
  });
}

/** Open modal for deleting item  */
openDeleteModal():void{
  const deleteMessage = MOCK_MESSAGES.find(m => m.id === 2);
  if(deleteMessage){
    this.modalTitle = deleteMessage.title;
    this.modalMessage = deleteMessage.message;
    this.isUpdate = false;
    if (this.messageDialog) {
      this.messageDialog.showModal();
    }
  }
}



}

   
  /* loadUsers(): void {
    this.authService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  } */


  

    
