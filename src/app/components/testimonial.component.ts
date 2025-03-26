import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-testimonial',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="testimonial" [ngStyle]="styles">
            <div class="quote">{{ quote }}</div>
            <div class="author-info">
                <img *ngIf="authorImage" [src]="authorImage" [alt]="authorName" class="author-image">
                <div class="author-details">
                    <div class="author-name">{{ authorName }}</div>
                    <div class="author-title">{{ authorTitle }}</div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .testimonial {
            padding: 24px;
            border-radius: 8px;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .quote {
            font-style: italic;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .author-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .author-image {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }
        .author-name {
            font-weight: bold;
        }
        .author-title {
            color: #666;
            font-size: 0.9rem;
        }
    `]
})
export class TestimonialComponent {
    @Input() quote!: string;
    @Input() authorName!: string;
    @Input() authorTitle!: string;
    @Input() authorImage?: string;
    @Input() styles?: Record<string, string>;
}