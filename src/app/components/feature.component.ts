import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-feature',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="feature-card" [ngStyle]="styles">
            <div class="icon" *ngIf="icon">{{ icon }}</div>
            <h3>{{ title }}</h3>
            <p>{{ description }}</p>
        </div>
    `,
    styles: [`
        .feature-card {
            padding: 24px;
            border-radius: 8px;
            text-align: center;
            transition: transform 0.3s;
        }
        .feature-card:hover {
            transform: translateY(-5px);
        }
        .icon {
            font-size: 2.5rem;
            margin-bottom: 16px;
            color: #007bff;
        }
        h3 {
            margin-bottom: 12px;
        }
    `]
})
export class FeatureComponent {
    @Input() title!: string;
    @Input() description!: string;
    @Input() icon?: string;
    @Input() styles?: Record<string, string>;
}