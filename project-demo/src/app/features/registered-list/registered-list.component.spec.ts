import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredListComponent } from './registered-list.component';

describe('RegisteredListComponent', () => {
  let component: RegisteredListComponent;
  let fixture: ComponentFixture<RegisteredListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisteredListComponent]
    });
    fixture = TestBed.createComponent(RegisteredListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
