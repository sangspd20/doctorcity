import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachPhienKhamComponent } from './danh-sach-phien-kham.component';

describe('DanhSachPhienKhamComponent', () => {
  let component: DanhSachPhienKhamComponent;
  let fixture: ComponentFixture<DanhSachPhienKhamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachPhienKhamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachPhienKhamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
