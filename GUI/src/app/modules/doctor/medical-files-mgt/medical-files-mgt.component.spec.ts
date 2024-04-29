import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFilesMgtComponent } from './medical-files-mgt.component';

describe('MedicalFilesMgtComponent', () => {
  let component: MedicalFilesMgtComponent;
  let fixture: ComponentFixture<MedicalFilesMgtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalFilesMgtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalFilesMgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
