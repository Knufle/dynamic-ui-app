import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation.component';

@Component({
    selector: 'app-root',
    template: `
        <app-navigation></app-navigation>
        <router-outlet></router-outlet>
    `,
    standalone: true,
    imports: [RouterOutlet, NavigationComponent]
})
export class AppComponent {
    title = 'dynamic-ui-app';
}
