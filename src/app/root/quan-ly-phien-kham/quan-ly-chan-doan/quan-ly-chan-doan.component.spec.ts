import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyChanDoanComponent } from './quan-ly-chan-doan.component';

describe('QuanLyChanDoanComponent', () => {
  let component: QuanLyChanDoanComponent;
  let fixture: ComponentFixture<QuanLyChanDoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyChanDoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuanLyChanDoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
