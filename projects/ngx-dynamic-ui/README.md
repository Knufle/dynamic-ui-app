# NgxDynamicUi

A powerful and flexible dynamic UI renderer library for Angular applications. This library allows you to define UI components using JSON configurations and render them dynamically at runtime.

## Features

- Render UI components dynamically from JSON definitions
- Support for custom components
- Dynamic loading of components via lazy loading
- Support for nested components and HTML elements
- Customizable styling and inputs for components
- Easy integration with existing Angular projects

## Installation

```bash
npm install ngx-dynamic-ui --save
```

## Basic Usage

### 1. Import the module in your app.module.ts

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { NgxDynamicUiModule } from 'ngx-dynamic-ui';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxDynamicUiModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2. Register global components using forRoot (optional)

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { NgxDynamicUiModule } from 'ngx-dynamic-ui';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxDynamicUiModule.forRoot({
      'MyCustomComponent': () => import('./components/my-custom.component').then(m => m.MyCustomComponent),
      'AnotherComponent': () => import('./components/another.component').then(m => m.AnotherComponent),
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 3. Use the component in your templates

```html
<lib-ngx-dynamic-ui [sections]="uiSections"></lib-ngx-dynamic-ui>
```

### 4. Define your UI structure in your component

```typescript
import { Component } from '@angular/core';
import { DynamicElement } from 'ngx-dynamic-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  uiSections: DynamicElement[] = [
    {
      type: 'container',
      tag: 'div',
      className: 'container',
      children: [
        {
          type: 'html',
          tag: 'h1',
          content: 'Welcome to my Dynamic UI',
          styles: {
            color: '#333',
            marginBottom: '20px'
          }
        },
        {
          type: 'component',
          component: 'MyCustomComponent',
          inputs: {
            title: 'Dynamic Component',
            data: { value: 42 }
          }
        }
      ]
    }
  ];

  // Or load from API
  // Constructor using HttpClient to fetch UI definition
}
```

### 5. Load UI definitions from an API

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DynamicElement, DynamicUIData } from 'ngx-dynamic-ui';

@Component({
  selector: 'app-root',
  template: `<lib-ngx-dynamic-ui [apiUrl]="apiUrl"></lib-ngx-dynamic-ui>`
})
export class AppComponent implements OnInit {
  apiUrl = 'http://your-api.com/ui-definitions';
}
```

## Advanced Usage

### Registering components at runtime

You can register components programmatically using the `NgxDynamicUiService`:

```typescript
import { Component, OnInit } from '@angular/core';
import { NgxDynamicUiService } from 'ngx-dynamic-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private dynamicUiService: NgxDynamicUiService) {}

  ngOnInit() {
    this.dynamicUiService.registerComponent(
      'DynamicCard', 
      () => import('./components/card.component').then(m => m.CardComponent)
    );
    
    this.dynamicUiService.registerComponents({
      'Feature': () => import('./components/feature.component').then(m => m.FeatureComponent),
      'Testimonial': () => import('./components/testimonial.component').then(m => m.TestimonialComponent)
    });
  }
}
```

### Using instance-specific components

You can provide component mappings specifically for a component instance:

```html
<lib-ngx-dynamic-ui 
  [sections]="uiSections" 
  [componentMap]="instanceSpecificComponents">
</lib-ngx-dynamic-ui>
```

And in your component:

```typescript
instanceSpecificComponents = {
  'LocalComponent': () => import('./components/local.component').then(m => m.LocalComponent)
};
```

## API Reference

### NgxDynamicUiComponent Inputs

| Input       | Type                                     | Description                                   |
|-------------|------------------------------------------|-----------------------------------------------|
| sections    | DynamicElement[]                         | Array of elements to render                   |
| apiUrl      | string                                   | URL to fetch UI definitions from              |
| componentMap| { [key: string]: () => Promise<any> }     | Map of component names to loader functions    |

### DynamicElement Interface

```typescript
interface DynamicElement {
    type: 'component' | 'container' | 'html';
    component?: string;
    tag?: string; // For HTML elements: div, p, h1, etc.
    content?: string;
    styles?: Record<string, string>;
    inputs?: Record<string, any>;
    children?: DynamicElement[];
    className?: string;
    attributes?: Record<string, string>;
}
```

## Development

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.0.

### Build

Run `ng build ngx-dynamic-ui` to build the project. The build artifacts will be stored in the `dist/` directory.

### Publishing

After building your library with `ng build ngx-dynamic-ui`, go to the dist folder `cd dist/ngx-dynamic-ui` and run `npm publish`.

## License

MIT
