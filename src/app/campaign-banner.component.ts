import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-campaign-banner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="banner">
      <h2>{{ title }}</h2>
      <img [src]="imageUrl" alt="Banner Image">
    </div>
  `,
    styles: [`
    .banner { text-align: center; padding: 20px; background: #f4f4f4; }
    .banner img { max-width: 100%; height: auto; }
  `]
})
export class CampaignBannerComponent {
    @Input() title!: string;
    @Input() imageUrl!: string;
}
