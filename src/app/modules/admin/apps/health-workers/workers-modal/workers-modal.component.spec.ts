import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkersModalComponent } from './workers-modal.component';

describe('WorkersModalComponent', () => {
  let component: WorkersModalComponent;
  let fixture: ComponentFixture<WorkersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
