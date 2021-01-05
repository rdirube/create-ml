import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material/expansion';
import {Observable} from 'rxjs';
import {LiftGameExercise} from '../../models/creators/lift-game-creator';
import {Creator} from '../../services/creators/creator';

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
  public creator: Creator<any, any, any>;
  @Input()
  public set formData(value: { form: FormGroup, initialDatas: LiftGameExercise, creator: Creator<any, any, any> }) {
    this._form = value.form;
    this.creator = value.creator;
    if (!value.form.get('statement')) {
      const initialData = value.initialDatas;
      this.creator.addControls(initialData, value.form);
    }
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  public addOption(): void {
    this.getCurrentOptionsFormArray().push(this.creator.makeOptionForm());
  }

  removeOption(index: number): void {
    this.getCurrentOptionsFormArray().removeAt(index);
    this.getCurrentOptionsFormArray().markAsDirty();
  }

  public getCurrentOptionsFormArray(): FormArray {
    return this._form.get('options') as FormArray;
  }
}
