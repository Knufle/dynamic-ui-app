import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxDynamicUiComponent } from './ngx-dynamic-ui.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxDynamicUiService } from './ngx-dynamic-ui.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgxDynamicUiComponent
  ],
  exports: [
    NgxDynamicUiComponent
  ],
  providers: [
    NgxDynamicUiService
  ]
})
export class NgxDynamicUiModule { 
  /**
   * Use this method in your root module to provide the NgxDynamicUiService
   * and configure it with default component loaders
   */
  static forRoot(componentLoaders: { [key: string]: () => Promise<any> } = {}): ModuleWithProviders<NgxDynamicUiModule> {
    return {
      ngModule: NgxDynamicUiModule,
      providers: [
        {
          provide: 'COMPONENT_LOADERS',
          useValue: componentLoaders
        },
        {
          provide: NgxDynamicUiService,
          useFactory: () => {
            const service = new NgxDynamicUiService();
            service.registerComponents(componentLoaders);
            return service;
          }
        }
      ]
    };
  }
}
