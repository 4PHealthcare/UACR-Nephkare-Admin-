import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthWorkersComponent } from './health-workers.component';

describe('HealthWorkersComponent', () => {
  let component: HealthWorkersComponent;
  let fixture: ComponentFixture<HealthWorkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthWorkersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
