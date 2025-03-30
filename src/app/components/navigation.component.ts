import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DynamicUIData } from '../interfaces/dynamic-ui.interface';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <nav *ngIf="navigation">
            <h2>{{ navigation.title }}</h2>
            <ul>
                <li *ngFor="let link of navigation.links">
                    <a [routerLink]="['/page', link.path]">{{ link.label }}</a>
                </li>
            </ul>
        </nav>
    `,
    styles: [`
        nav {
            padding: 1rem;
            background: #f5f5f5;
        }
        ul {
            list-style: none;
            padding: 0;
            display: flex;
            gap: 1rem;
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
    `]
})
export class NavigationComponent implements OnInit {
    navigation?: { title: string; links: { path: string; label: string; }[] };

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.http.get<DynamicUIData>('http://localhost:3000/ui-data')
            .subscribe(data => {
                this.navigation = data.navigation;
            });
    }
}