
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

import { LoginComponent } from './features/auth/login/login.component';
import { EnrollmentComponent } from './features/auth/enrollment/enrollment.component';
import { HomeComponent } from './features/home/home.component';
import { ManageAccountComponent } from './features/manage-account/manage-account.component';
import { EcommerceComponent } from './features/ecommerce/ecommerce.component';
import { ContactsComponent } from './features/contacts/contacts.component';
import { GalleryComponent } from './features/gallery/gallery.component';
import { RegisteredListComponent } from './features/registered-list/registered-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: EnrollmentComponent },
  { path: 'manage-account', component: ManageAccountComponent, canActivate: [authGuard]},
  { path: 'home', component: HomeComponent, canActivate: [authGuard]},
  { path: 'gallery', component: GalleryComponent, canActivate: [authGuard]},
  { path: 'ecommerce', component: EcommerceComponent, canActivate: [authGuard]},
  { path: 'contacts', component: ContactsComponent, canActivate: [authGuard]},
  { path: 'registered-list', component: RegisteredListComponent, canActivate: [authGuard]},
  { path: '**', redirectTo: '/home' } // Rotta di fallback
];


