import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyPhienKhamComponent } from './quan-ly-phien-kham.component';

describe('QuanLyPhienKhamComponent', () => {
  let component: QuanLyPhienKhamComponent;
  let fixture: ComponentFixture<QuanLyPhienKhamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyPhienKhamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuanLyPhienKhamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
