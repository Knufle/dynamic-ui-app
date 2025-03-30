import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-mat-button',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    template: `
        <button *ngIf="!raised" 
                mat-button
                [color]="color"
                [ngStyle]="styles">
            {{text}}
        </button>
        <button *ngIf="raised"
                mat-raised-button
                [color]="color"
                [ngStyle]="styles">
            {{text}}
        </button>
    `
})
export class MatButtonComponent {
    @Input() text!: string;
    @Input() raised?: boolean;
    @Input() color?: 'primary' | 'accent' | 'warn';
    @Input() styles?: Record<string, string>;
}