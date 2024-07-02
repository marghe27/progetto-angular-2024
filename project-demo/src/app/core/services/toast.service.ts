import { Injectable, TemplateRef } from '@angular/core';

export enum toastTypes {
  error,
  success
};

export interface Toast {
	template: TemplateRef<any>;
	classname?: string;
	delay?: number;
}


@Injectable({
  providedIn: 'root'
})

export class ToastService {
  toasts: Toast[] = [];

  constructor() { }

  /* { template: import("@angular/core").TemplateRef<any>; classname: string; delay: number; } */
  show(toast: Toast ) {
    //throw new Error('Method not implemented.');
    this.toasts.push(toast);
    
  }

  remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}

  

}
