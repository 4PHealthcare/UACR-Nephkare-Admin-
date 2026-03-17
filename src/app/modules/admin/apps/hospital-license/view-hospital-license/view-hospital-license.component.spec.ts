import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHospitalLicenseComponent } from './view-hospital-license.component';

describe('ViewDoctorComponent', () => {
  let component: ViewHospitalLicenseComponent;
  let fixture: ComponentFixture<ViewHospitalLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHospitalLicenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHospitalLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
