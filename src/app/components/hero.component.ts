import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="hero" [ngStyle]="styles">
            <h1>{{ title }}</h1>
            <p class="subtitle">{{ subtitle }}</p>
            <div *ngIf="ctaText" class="cta-button">
                {{ ctaText }}
            </div>
        </div>
    `,
    styles: [`
        .hero {
            text-align: center;
            padding: 60px 20px;
        }
        .subtitle {
            font-size: 1.2rem;
            margin: 20px 0;
        }
        .cta-button {
            display: inline-block;
            padding: 12px 24px;
            background: #007bff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .cta-button:hover {
            background: #0056b3;
        }
    `]
})
export class HeroComponent {
    @Input() title!: string;
    @Input() subtitle!: string;
    @Input() ctaText?: string;
    @Input() styles?: Record<string, string>;
}