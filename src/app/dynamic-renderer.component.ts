import { Component, ViewChildren, ViewContainerRef, QueryList, OnInit, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Section {
    type: 'html' | 'component';
    content?: string;
    component?: string;
    inputs?: Record<string, unknown>;
}

@Component({
    selector: 'app-dynamic-renderer',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    template: `
    <div *ngFor="let section of sections; let i = index">
      <div *ngIf="section.type === 'html'" [innerHTML]="section.content"></div>
      <div *ngIf="section.type === 'component'">
        <ng-container #dynamicContainer></ng-container>
      </div>
    </div>
  `
})
export class DynamicRendererComponent implements OnInit {
    @ViewChildren('dynamicContainer', { read: ViewContainerRef }) containers!: QueryList<ViewContainerRef>;
    sections: Section[] = [];

    constructor(private http: HttpClient, private injector: Injector) { }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.http.get<any>('http://localhost:3000/ui-data').subscribe((data) => {
            this.sections = data.sections;
            // Wait for view to be ready
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
                const container = containerArray[containerIndex];
                if (!container) continue;

                try {
                    const componentType = await this.loadComponent(section.component);
                    if (componentType) {
                        container.clear();
                        const componentRef = container.createComponent(componentType);
                        if (section.inputs && componentRef.instance) {
                            Object.assign(componentRef.instance, section.inputs);
                        }
                        componentRef.changeDetectorRef.detectChanges();
                    }
                } catch (error) {
                    console.error(`Error loading component ${section.component}:`, error);
                }
                containerIndex++;
            }
        }
    }

    private async loadComponent(name: string): Promise<any> {
        const componentMap: { [key: string]: () => Promise<any> } = {
            'CampaignBannerComponent': () => import('./campaign-banner.component').then(m => m.CampaignBannerComponent)
        };

        return componentMap[name] ? componentMap[name]() : null;
    }
}
