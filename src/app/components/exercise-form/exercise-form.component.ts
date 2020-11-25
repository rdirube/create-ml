import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {CreatorService} from '../../services/creator.service';
import {ChoiceExercise} from '../../models/types';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss']
})
export class ExerciseFormComponent implements OnInit {

  private _form: FormGroup;
  get form(): FormGroup {
    return this._form;
  }
  @Input()
  public set formData(value: {form: FormGroup, initialDatas: ChoiceExercise}) {
    this._form = value.form;
    console.log(value);
    if (!value.form.get('statement')) {
      const initialData = value.initialDatas;
      this.creatorService.addControls(initialData, value.form);

    }
  }




  constructor(private creatorService: CreatorService) { }

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
