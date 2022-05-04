import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanLamSangComponent } from './can-lam-sang.component';

describe('CanLamSangComponent', () => {
  let component: CanLamSangComponent;
  let fixture: ComponentFixture<CanLamSangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanLamSangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanLamSangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
