import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDynamicUiComponent } from './ngx-dynamic-ui.component';

describe('NgxDynamicUiComponent', () => {
  let component: NgxDynamicUiComponent;
  let fixture: ComponentFixture<NgxDynamicUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxDynamicUiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxDynamicUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
