import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationsFormComponent } from './relations-form.component';

describe('RelationsFormComponent', () => {
  let component: RelationsFormComponent;
  let fixture: ComponentFixture<RelationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
