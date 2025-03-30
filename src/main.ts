import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, HttpClientModule),
        provideRouter(routes)
    ]
}).catch(err => console.error(err));
