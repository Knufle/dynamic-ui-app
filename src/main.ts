import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { DynamicRendererComponent } from './app/dynamic-renderer.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(DynamicRendererComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideRouter(routes)
    ]
})
  .catch(err => console.error(err));
