import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-campaign-banner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [ngStyle]="styles">
      <h2>{{ title }}</h2>
      <img [src]="imageUrl" alt="Banner Image">
    </div>
  `,
    styles: []
})
export class CampaignBannerComponent {
    @Input() title!: string;
    @Input() imageUrl!: string;
    @Input() styles?: Record<string, string>;
}
