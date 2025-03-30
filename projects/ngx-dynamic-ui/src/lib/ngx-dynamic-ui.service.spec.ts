import { TestBed } from '@angular/core/testing';

import { NgxDynamicUiService } from './ngx-dynamic-ui.service';

describe('NgxDynamicUiService', () => {
  let service: NgxDynamicUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDynamicUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
