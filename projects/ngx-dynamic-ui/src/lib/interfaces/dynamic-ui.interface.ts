export interface DynamicPage {
    path: string;
    title: string;
    sections: DynamicElement[];
}

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
    pages: DynamicPage[];
    navigation?: {
        title: string;
        links: { path: string; label: string; }[];
    };
}

export interface DynamicComponent {
    styles?: Record<string, string>;
    [key: string]: any;
}