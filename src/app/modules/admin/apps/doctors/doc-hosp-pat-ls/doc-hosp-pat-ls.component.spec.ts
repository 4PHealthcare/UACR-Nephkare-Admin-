import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocHospPatLsComponent } from './doc-hosp-pat-ls.component';

describe('DocHospPatLsComponent', () => {
  let component: DocHospPatLsComponent;
  let fixture: ComponentFixture<DocHospPatLsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocHospPatLsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocHospPatLsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
