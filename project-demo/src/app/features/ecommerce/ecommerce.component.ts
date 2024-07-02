import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from 'src/app/core/components/nav-bar/nav-bar.component';
import { FooterComponent} from '../../core/components/footer/footer.component';

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule,
    NavBarComponent, 
    FooterComponent
  ],
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss']
})
export class EcommerceComponent {

}
