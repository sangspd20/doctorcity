import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeCustomerComponent } from './welcome-customer.component';

describe('WelcomeCustomerComponent', () => {
  let component: WelcomeCustomerComponent;
  let fixture: ComponentFixture<WelcomeCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
