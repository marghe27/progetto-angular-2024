import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    CommonModule, 
  ],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  show = true;
  toastService = inject(ToastService);
  
}


