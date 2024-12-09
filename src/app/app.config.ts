import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoadingInterceptor } from './services/loading-interceptor/loading-interceptor.service';
import { TokenInterceptor } from './services/global/token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: 
    [
      provideRouter(routes), 
      provideAnimations(),
      provideHttpClient(
        withInterceptors([LoadingInterceptor, TokenInterceptor])
      ),
      // importProvidersFrom(InMemoryWebApiModule.forRoot(ProductData, { delay: 1000 }))
    ]
};
