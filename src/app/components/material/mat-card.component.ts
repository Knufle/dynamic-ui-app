import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-mat-card',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule],
    template: `
        <mat-card [ngStyle]="styles">
            <mat-card-header *ngIf="title || subtitle">
                <mat-card-title *ngIf="title">{{title}}</mat-card-title>
                <mat-card-subtitle *ngIf="subtitle">{{subtitle}}</mat-card-subtitle>
            </mat-card-header>
            <img mat-card-image *ngIf="image" [src]="image" [alt]="imageAlt || title">
            <mat-card-content *ngIf="content">
                <p>{{content}}</p>
            </mat-card-content>
            <mat-card-actions *ngIf="actions?.length">
                <button mat-button *ngFor="let action of actions">{{action}}</button>
            </mat-card-actions>
        </mat-card>
    `
})
export class MatCardComponent {
    @Input() title?: string;
    @Input() subtitle?: string;
    @Input() content?: string;
    @Input() image?: string;
    @Input() imageAlt?: string;
    @Input() actions?: string[];
    @Input() styles?: Record<string, string>;
}