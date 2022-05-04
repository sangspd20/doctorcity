import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccountDetailComponent } from './my-account-detail.component';

describe('MyAccountDetailComponent', () => {
  let component: MyAccountDetailComponent;
  let fixture: ComponentFixture<MyAccountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAccountDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
