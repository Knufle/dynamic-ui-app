import { Component, ViewChild, ViewContainerRef, ComponentRef, OnInit, Injector, Type, ElementRef, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DynamicElement, DynamicUIData } from './interfaces/dynamic-ui.interface';

interface DynamicComponent {
    styles?: Record<string, string>;
    [key: string]: any;
}

@Component({
    selector: 'app-dynamic-renderer',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    template: `
        <div #container></div>
    `
})
export class DynamicRendererComponent implements OnInit {
    @ViewChild('container', { static: true }) container!: ElementRef;
    
    sections: DynamicElement[] = [];
    private componentRefs: ComponentRef<DynamicComponent>[] = [];

    constructor(
        private http: HttpClient,
        private injector: EnvironmentInjector,
        private appRef: ApplicationRef
    ) {}

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.http.get<DynamicUIData>('http://localhost:3000/ui-data').subscribe((data) => {
            this.sections = data.sections;
            this.renderElements();
        });
    }

    private async renderElements() {
        // Clear previous content
        this.componentRefs.forEach(ref => ref.destroy());
        this.componentRefs = [];
        const containerElement = this.container.nativeElement;
        containerElement.innerHTML = '';

        // Render each section in order
        for (const section of this.sections) {
            await this.renderElement(section, containerElement);
        }
    }

    private async renderElement(element: DynamicElement, parentElement: HTMLElement) {
        let elementRef: HTMLElement | null = null;

        switch (element.type) {
            case 'component':
                await this.renderComponent(element, parentElement);
                break;

            case 'container':
            case 'html':
                elementRef = this.createHtmlElement(element);
                if (elementRef) {
                    parentElement.appendChild(elementRef);
                }
                break;
        }

        // Render children if they exist
        if (element.children && elementRef) {
            for (const child of element.children) {
                await this.renderElement(child, elementRef);
            }
        }
    }

    private createHtmlElement(element: DynamicElement): HTMLElement {
        const tag = element.tag || 'div';
        const el = document.createElement(tag);

        // Apply styles
        if (element.styles) {
            Object.assign(el.style, element.styles);
        }

        // Apply classes
        if (element.className) {
            el.className = element.className;
        }

        // Apply content
        if (element.content) {
            el.textContent = element.content;
        }

        // Apply attributes
        if (element.attributes) {
            Object.entries(element.attributes).forEach(([key, value]) => {
                el.setAttribute(key, value);
            });
        }

        return el;
    }

    private async renderComponent(element: DynamicElement, parentElement: HTMLElement) {
        if (!element.component) return;

        try {
            const componentType = await this.loadComponent(element.component);
            if (componentType) {
                // Create a container for the component
                const componentContainer = document.createElement('div');
                parentElement.appendChild(componentContainer);

                // Create component
                const componentRef = createComponent(componentType, {
                    environmentInjector: this.injector,
                    hostElement: componentContainer
                });

                // Set inputs
                if (element.inputs) {
                    Object.assign(componentRef.instance, element.inputs);
                }

                if (element.styles) {
                    componentRef.instance.styles = element.styles;
                }

                this.componentRefs.push(componentRef);
                this.appRef.attachView(componentRef.hostView);
                componentRef.changeDetectorRef.detectChanges();
            }
        } catch (error) {
            console.error(`Error loading component ${element.component}:`, error);
        }
    }

    private async loadComponent(name: string): Promise<Type<DynamicComponent> | null> {
        const componentMap: { [key: string]: () => Promise<any> } = {
            'CampaignBannerComponent': () => import('./campaign-banner.component').then(m => m.CampaignBannerComponent),
            'HeroComponent': () => import('./components/hero.component').then(m => m.HeroComponent),
            'FeatureComponent': () => import('./components/feature.component').then(m => m.FeatureComponent),
            'TestimonialComponent': () => import('./components/testimonial.component').then(m => m.TestimonialComponent)
        };

        return componentMap[name] ? componentMap[name]() : null;
    }
}
