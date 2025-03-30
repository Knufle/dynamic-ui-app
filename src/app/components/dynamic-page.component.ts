import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { DynamicRendererComponent } from '../dynamic-renderer.component';
import { DynamicPage, DynamicUIData } from '../interfaces/dynamic-ui.interface';

@Component({
    selector: 'app-dynamic-page',
    standalone: true,
    imports: [CommonModule, DynamicRendererComponent],
    template: `
        <app-dynamic-renderer *ngIf="currentPage" [sections]="currentPage.sections"></app-dynamic-renderer>
    `
})
export class DynamicPageComponent implements OnInit {
    currentPage?: DynamicPage;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private titleService: Title
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            const path = params['path'];
            this.loadPageData(path);
        });
    }

    private loadPageData(path: string) {
        this.http.get<DynamicUIData>('http://localhost:3000/ui-data')
            .subscribe(data => {
                this.currentPage = data.pages.find(page => page.path === path);
                if (this.currentPage) {
                    this.titleService.setTitle(this.currentPage.title);
                }
            });
    }
}