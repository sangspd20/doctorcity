import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinTongQuanComponent } from './thong-tin-tong-quan.component';

describe('ThongTinTongQuanComponent', () => {
  let component: ThongTinTongQuanComponent;
  let fixture: ComponentFixture<ThongTinTongQuanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinTongQuanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinTongQuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
