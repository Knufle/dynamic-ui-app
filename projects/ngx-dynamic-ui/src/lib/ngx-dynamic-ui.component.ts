import { Component, ViewChild, ElementRef, ApplicationRef, Type, EnvironmentInjector, Renderer2, Input, OnInit, OnChanges, SimpleChanges, ComponentRef, createComponent } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DynamicElement, DynamicUIData, DynamicComponent } from './interfaces/dynamic-ui.interface';
import { NgxDynamicUiService } from './ngx-dynamic-ui.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngx-dynamic-ui',
  template: `<div #container></div>`,
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  styles: []
})
export class NgxDynamicUiComponent implements OnInit, OnChanges {
  @ViewChild('container', { static: true }) container!: ElementRef;
  @Input() sections: DynamicElement[] = [];
  @Input() apiUrl?: string;
  
  /**
   * Map of component names to their import functions.
   * Consumers can extend this with their own components
   */
  @Input() componentMap: { [key: string]: () => Promise<any> } = {};
    
  private componentRefs: ComponentRef<DynamicComponent>[] = [];
  private moduleRefs = new Map<string, any>();
  private defaultApiUrl = 'http://localhost:3000/ui-data';

  constructor(
    private http: HttpClient,
    private injector: EnvironmentInjector,
    private appRef: ApplicationRef,
    private renderer: Renderer2,
    private dynamicUiService: NgxDynamicUiService
  ) {}

  ngOnInit() {
    if (!this.sections.length) {
      this.loadData();
    } else {
      this.renderElements();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sections'] && !changes['sections'].firstChange) {
      this.renderElements();
    }
  }

  private loadData() {
    const url = this.apiUrl || this.defaultApiUrl;
    this.http.get<DynamicUIData>(url).subscribe({
      next: (data) => {
        if ('sections' in data) {
          this.sections = (data as { sections: DynamicElement[] }).sections;
        } else if (data.pages && data.pages.length > 0) {
          this.sections = data.pages[0].sections;
        }
        this.renderElements();
      },
      error: (error) => {
        console.error('Error loading dynamic UI data:', error);
      }
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
    // First check user-provided components
    if (this.componentMap[name]) {
      return this.componentMap[name]();
    }
    
    // Then check if the component is registered with the service
    const registeredComponent = this.dynamicUiService.getComponentLoader(name);
    if (registeredComponent) {
      return registeredComponent();
    }
    
    return null;
  }
}
