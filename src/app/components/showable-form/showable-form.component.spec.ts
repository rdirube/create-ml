import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowableFormComponent } from './showable-form.component';

describe('ShowableFormComponent', () => {
  let component: ShowableFormComponent;
  let fixture: ComponentFixture<ShowableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowableFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
