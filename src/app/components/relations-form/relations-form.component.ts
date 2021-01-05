import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {Creator} from '../../services/creators/creator';
import {SequenceGameExercise} from '../../models/creators/sort-elements';

@Component({
  selector: 'app-relations-form',
  templateUrl: './relations-form.component.html',
  styleUrls: ['./relations-form.component.scss']
})
export class RelationsFormComponent implements OnInit {

  private _form: FormGroup;
  @Input() mediaFilesAlreadyLoaded: Map<string, Observable<string>>[];

  optionPropertiesForm: FormGroup;
  readonly maxOptions = 10;
  readonly minOptions = 2;

  get form(): FormGroup {
    return this._form;
  }

  public creator: Creator<any, any, any>;

  @Input()
  public set formData(value: { form: FormGroup, initialDatas: SequenceGameExercise, creator: Creator<any, any, any> }) {
    this._form = value.form;
    this.creator = value.creator;
    if (!value.form.get('statement')) {
      const initialData = value.initialDatas;
      this.creator.addControls(initialData, value.form);
    }
    console.log('form', this.form);
    console.log('relation array', this.getFormArray('relations').controls);
    // console.log('relatio', this.getFormArray('relations').controls.map( x => x.get('relation')));
  }

  constructor(private cdr: ChangeDetectorRef,
              private formBuilder: FormBuilder) {
    this.optionPropertiesForm = this.formBuilder.group({
      optionsWithAudio: false,
      optionsWithText: true,
      optionsWithImage: true,
    });
  }

  ngOnInit(): void {
  }

  public addOption(form: string): void {
    console.log('THIS MUST BE DONE IN THE CREATOR. FIX');
    console.log('THIS MUST BE DONE IN THE CREATOR. FIX');
    console.log('THIS MUST BE DONE IN THE CREATOR. FIX');
    console.log('THIS MUST BE DONE IN THE CREATOR. FIX');
    this.getFormArray(form).push(this.creator.makeRelationForm({
      relation: [
        {audio: '', image: '', text: '1', video: ''},
        {audio: '', image: '', text: '1', video: ''},
      ]
    }));
  }

  removeOption(form: string, index: number): void {
    this.getFormArray(form).removeAt(index);
    this.getFormArray(form).markAsDirty();
  }

  getFormArray(form: string): FormArray {
    return this._form.get(form) as FormArray;
  }
}
