import { Component, ViewChildren, ViewContainerRef, QueryList, OnInit, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Column {
    type: 'html' | 'component';
    content?: string;
    component?: string;
    inputs?: Record<string, unknown>;
    styles?: Record<string, string>;
}

interface Section {
    type: 'html' | 'component' | 'row';
    content?: string;
    component?: string;
    inputs?: Record<string, unknown>;
    columns?: Column[];
    styles?: Record<string, string>;
}

@Component({
    selector: 'app-dynamic-renderer',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    template: `
    <div *ngFor="let section of sections; let i = index">
      <div *ngIf="section.type === 'html'" [innerHTML]="getSafeHtml(section.content)" [ngStyle]="section.styles"></div>
      <div *ngIf="section.type === 'component'" [ngStyle]="section.styles">
        <ng-container #dynamicContainer></ng-container>
      </div>
      <div *ngIf="section.type === 'row'" class="row-container" [ngStyle]="section.styles">
        <ng-container *ngFor="let column of section.columns">
          <div [ngStyle]="column.styles">
            <div *ngIf="column.type === 'html'" [innerHTML]="getSafeHtml(column.content)"></div>
            <div *ngIf="column.type === 'component'" [ngStyle]="column.styles">
              <ng-container #dynamicContainer></ng-container>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
    styles: [`
    .row-container {
      display: flex;
      flex-direction: row;
      gap: 20px;
      margin: 20px 0;
    }
  `]
})
export class DynamicRendererComponent implements OnInit {
    @ViewChildren('dynamicContainer', { read: ViewContainerRef }) containers!: QueryList<ViewContainerRef>;
    sections: Section[] = [];

    constructor(
        private http: HttpClient, 
        private injector: Injector,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.http.get<any>('http://localhost:3000/ui-data').subscribe((data) => {
            this.sections = data.sections;
            setTimeout(() => this.renderComponents(), 0);
        });
    }

    private async renderComponents() {
        if (!this.containers) {
            console.error('ViewContainerRef list is not available');
            return;
        }

        const containerArray = this.containers.toArray();
        let containerIndex = 0;

        for (const section of this.sections) {
            if (section.type === 'component' && section.component) {
                await this.renderComponent(containerArray[containerIndex++], section);
            } else if (section.type === 'row' && section.columns) {
                for (const column of section.columns) {
                    if (column.type === 'component' && column.component) {
                        await this.renderComponent(containerArray[containerIndex++], column);
                    }
                }
            }
        }
    }

    private async renderComponent(container: ViewContainerRef, component: Column | Section) {
        if (!container || !component.component) return;

        try {
            const componentType = await this.loadComponent(component.component);
            if (componentType) {
                container.clear();
                const componentRef = container.createComponent(componentType);
                if (component.inputs && componentRef.instance) {
                    Object.assign(componentRef.instance as object, component.inputs);
                }
                componentRef.changeDetectorRef.detectChanges();
            }
        } catch (error) {
            console.error(`Error loading component ${component.component}:`, error);
        }
    }

    private async loadComponent(name: string): Promise<any> {
        const componentMap: { [key: string]: () => Promise<any> } = {
            'CampaignBannerComponent': () => import('./campaign-banner.component').then(m => m.CampaignBannerComponent),
            'HeroComponent': () => import('./components/hero.component').then(m => m.HeroComponent),
            'FeatureComponent': () => import('./components/feature.component').then(m => m.FeatureComponent),
            'TestimonialComponent': () => import('./components/testimonial.component').then(m => m.TestimonialComponent)
        };

        return componentMap[name] ? componentMap[name]() : null;
    }

    getSafeHtml(content: string | undefined): SafeHtml {
        if (!content) return '';
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }
}
