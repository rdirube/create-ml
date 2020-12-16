import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material/expansion';
import {Observable} from 'rxjs';
import {LiftGameExercise} from '../../models/creators/lift-game-creator';
import {LiftGameService} from '../../services/creators/lift-game.service';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
  viewProviders: [MatExpansionPanel]
})
export class ExerciseFormComponent implements OnInit {

  private _form: FormGroup;

  @Input() mediaFilesAlreadyLoaded: Map<string, Observable<string>>[];

  get form(): FormGroup {
    return this._form;
  }

  @Input()
  public set formData(value: { form: FormGroup, initialDatas: LiftGameExercise }) {
    this._form = value.form;
    if (!value.form.get('statement')) {
      const initialData = value.initialDatas;
      this.creatorService.addControls(initialData, value.form);
    }
  }

  constructor(private creatorService: LiftGameService) {
  }

  ngOnInit(): void {
  }

  public addOption(): void {
    this.getCurrentOptionsFormArray().push(this.creatorService.makeOptionForm());
  }

  removeOption(index: number): void {
    this.getCurrentOptionsFormArray().removeAt(index);
    this.getCurrentOptionsFormArray().markAsDirty();
  }

  public getCurrentOptionsFormArray(): FormArray {
    return this._form.get('options') as FormArray;
  }

}
