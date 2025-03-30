import { Routes } from '@angular/router';
import { DynamicPageComponent } from './components/dynamic-page.component';

export const routes: Routes = [
    { path: 'page/:path', component: DynamicPageComponent },
    { path: '', redirectTo: 'page/home', pathMatch: 'full' }
];