import { TestBed } from '@angular/core/testing';

import { ConectorModalService } from './conector-modal.service';

describe('ConectorModalService', () => {
  let service: ConectorModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConectorModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
