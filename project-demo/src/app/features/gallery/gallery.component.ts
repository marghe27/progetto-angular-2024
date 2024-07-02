import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from 'src/app/core/components/nav-bar/nav-bar.component';
import { FooterComponent} from '../../core/components/footer/footer.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule,
    NavBarComponent,
    FooterComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {

}
