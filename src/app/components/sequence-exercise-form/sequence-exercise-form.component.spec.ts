import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceExerciseFormComponent } from './sequence-exercise-form.component';

describe('SequenceExerciseFormComponent', () => {
  let component: SequenceExerciseFormComponent;
  let fixture: ComponentFixture<SequenceExerciseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SequenceExerciseFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceExerciseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
