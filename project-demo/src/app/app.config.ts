
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http'; 
import { TokenInterceptorService } from './core/interceptors/token-interceptor.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), 
    {
      provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi:true
    }
    // Altri provider come HttpClientModule, FormsModule, etc. se necessario
  ],
};


  