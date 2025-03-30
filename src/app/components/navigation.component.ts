import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <nav *ngIf="navigation" class="nav-container" [ngStyle]="styles">
            <h2>{{ navigation.title }}</h2>
            <ul>
                <li *ngFor="let link of navigation.links">
                    <a [routerLink]="['/page', link.path]">{{ link.label }}</a>
                </li>
            </ul>
        </nav>
    `,
    styles: [`
        .nav-container {
            padding: 1rem;
            background: #f5f5f5;
            margin-bottom: 1rem;
        }
        ul {
            list-style: none;
            padding: 0;
            display: flex;
            gap: 1rem;
            margin: 0;
        }
        a {
            text-decoration: none;
            color: #333;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        a:hover {
            background-color: #e0e0e0;
        }
        h2 {
            margin-top: 0;
            margin-bottom: 1rem;
        }
    `]
})
export class NavigationComponent {
    @Input() navigation?: { 
        title: string; 
        links: { path: string; label: string; }[] 
    };
    @Input() styles?: Record<string, string>;
}