import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // eventCoalescing batches multiple events into one CD cycle → fewer renders
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Preload lazy routes in background after app starts → no delay on navigation
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // JWT interceptor attached once here, not per-component
    provideHttpClient(withInterceptors([jwtInterceptor])),
    // Sync animations — avoids async bundle blocking the first paint
    provideAnimations()
  ]
};
