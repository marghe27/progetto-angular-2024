import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { User } from 'src/app/core/models/user';



@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [
    CommonModule, 
   
  ],
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss'],
})
export class MessageDialogComponent implements OnInit {

 //@Input() public message!: Message;
 @Input() modalTitle: string = '';
 @Input() modalMessage: string = '';
 @Input() isUpdate:boolean = true;
 @Input() user!:User;
 @Output() updateUser = new EventEmitter<void>();
 @Output() deleteUser = new EventEmitter<void>();

 @ViewChild('messageDialog', {static: false}) messageDialog!:ElementRef<HTMLDialogElement>;

 
  
  constructor( ) { }

  
  ngOnInit(): void { }

  showModal():void{
    if(this.messageDialog && this.messageDialog.nativeElement){
      this.messageDialog.nativeElement.showModal();
    }else{
      console.error('Modal element is not available!')
    }
  }

 closeModal():void{
  if(this.messageDialog && this.messageDialog.nativeElement){
    this.messageDialog.nativeElement.close();
  }else{
    console.error('Modal element is not available!')
  }
}


} 