import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
// Hash-based routing is one way to handle page refreshes with static file servers
// Another approach is to configure your web server (like CloudFront) to redirect 404s to index.html
// You can switch between approaches by toggling the withHashLocation() below
// import { provideRouter, withHashLocation } from '@angular/router';
// import { routes } from './app/app.routes';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, HttpClientModule),
        // For production with proper server config (e.g., CloudFront redirecting 404s to index.html),
        // you can remove withHashLocation() to have cleaner URLs without the # symbol
        // provideRouter(routes, withHashLocation())
    ]
}).catch(err => console.error(err));
