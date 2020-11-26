import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CreatorService} from '../../services/creator.service';
import {ChoiceExercise} from '../../models/types';
import {MatExpansionPanel} from '@angular/material/expansion';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
  viewProviders: [MatExpansionPanel]
})
export class ExerciseFormComponent implements OnInit {

  private _form: FormGroup;

  optionPropertiesForm: FormGroup;

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


  constructor(private creatorService: CreatorService,
              private cdr: ChangeDetectorRef,
              private formBuilder: FormBuilder) {
    this.optionPropertiesForm = this.formBuilder.group({
      optionsWithAudio: false,
      optionsWithText: true,
      optionsWithImage: true,
    });
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

  getIconName(i: string): string {
    switch (i) {
      case 'optionsWithText': return 'text_fields';
      case 'optionsWithImage': return 'image';
      case 'optionsWithAudio': return 'audiotrack';
    }
  }

  getPropertyText(i: string): string {
    switch (i) {
      case 'optionsWithText': return 'Texto';
      case 'optionsWithImage': return 'Imagen';
      case 'optionsWithAudio': return 'Audio';
    }
  }
}
