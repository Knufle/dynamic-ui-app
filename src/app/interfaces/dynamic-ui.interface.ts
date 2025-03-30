export interface DynamicElement {
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

export interface DynamicUIData {
    sections: DynamicElement[];
}