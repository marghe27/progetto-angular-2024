import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
/* import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service'; */
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    CommonModule, 
    /* NgbToastModule, 
    NgIf, 
    NgTemplateOutlet */
  ],
  template: `
      <!-- <div  *ngFor="let toast of toastService.toasts">
			<ngb-toast
				[class]="toast.classname"
				[autohide]="true"
				[delay]="toast.delay || 5000"
				(hidden)="toastService.remove(toast)">
				<ng-template [ngTemplateOutlet]="toast.template"></ng-template>
			</ngb-toast>
    </div> -->
  `,
	host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
  //templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  show = true;
  //toastService = inject(ToastService);
  
}


