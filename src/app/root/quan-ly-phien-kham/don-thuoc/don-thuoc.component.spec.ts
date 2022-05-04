import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonThuocComponent } from './don-thuoc.component';

describe('DonThuocComponent', () => {
  let component: DonThuocComponent;
  let fixture: ComponentFixture<DonThuocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonThuocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonThuocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
