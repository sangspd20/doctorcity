import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrieuChungItemComponent } from './trieu-chung-item.component';

describe('TrieuChungItemComponent', () => {
  let component: TrieuChungItemComponent;
  let fixture: ComponentFixture<TrieuChungItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrieuChungItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrieuChungItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
