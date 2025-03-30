import { Injectable, Type } from '@angular/core';
import { DynamicComponent } from './interfaces/dynamic-ui.interface';

@Injectable({
  providedIn: 'root'
})
export class NgxDynamicUiService {
  private componentLoaders = new Map<string, () => Promise<Type<DynamicComponent>>>();

  constructor() { }

  /**
   * Register a component loader function for a given component name
   * @param name The name of the component to register
   * @param loader Function that returns a Promise that resolves to the component
   */
  registerComponent(name: string, loader: () => Promise<Type<DynamicComponent>>) {
    this.componentLoaders.set(name, loader);
    return this; // For method chaining
  }

  /**
   * Register multiple components at once
   * @param components Map of component names to loader functions
   */
  registerComponents(components: { [key: string]: () => Promise<Type<DynamicComponent>> }) {
    Object.entries(components).forEach(([name, loader]) => {
      this.registerComponent(name, loader);
    });
    return this; // For method chaining
  }

  /**
   * Get a component loader function for a given component name
   * @param name The name of the component to get
   * @returns The loader function or undefined if not found
   */
  getComponentLoader(name: string) {
    return this.componentLoaders.get(name);
  }

  /**
   * Remove a component loader function for a given component name
   * @param name The name of the component to unregister
   */
  unregisterComponent(name: string) {
    this.componentLoaders.delete(name);
    return this; // For method chaining
  }

  /**
   * Check if a component is registered
   * @param name The name of the component to check
   * @returns true if the component is registered, false otherwise
   */
  hasComponent(name: string) {
    return this.componentLoaders.has(name);
  }

  /**
   * Clear all registered components
   */
  clearComponents() {
    this.componentLoaders.clear();
    return this; // For method chaining
  }
}
