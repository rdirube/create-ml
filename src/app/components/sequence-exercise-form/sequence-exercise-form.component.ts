import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {SequenceGameExercise} from '../../models/creators/sort-elements';
import {SortElementsGameService} from '../../services/creators/sort-elements-game.service';

@Component({
  selector: 'app-sequence-exercise-form',
  templateUrl: './sequence-exercise-form.component.html',
  styleUrls: ['./sequence-exercise-form.component.scss']
})
export class SequenceExerciseFormComponent implements OnInit {

  private _form: FormGroup;

  @Input() mediaFilesAlreadyLoaded: Map<string, Observable<string>>[];

  optionPropertiesForm: FormGroup;
  readonly maxOptions = 10;
  readonly minOptions = 2;

  get form(): FormGroup {
    return this._form;
  }

  @Input()
  public set formData(value: { form: FormGroup, initialDatas: SequenceGameExercise }) {
    this._form = value.form;
    console.log(this.form);
    if (!value.form.get('statement')) {
      const initialData = value.initialDatas;
      this.creatorService.addControls(initialData, value.form);
    }
  }


  constructor(private creatorService: SortElementsGameService,
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


  public addOption(form: string): void {
    this.getFormArray(form).push(this.creatorService.makeShowableForm());
  }

  removeOption(form: string, index: number): void {
    this.getFormArray(form).removeAt(index);
    this.getFormArray(form).markAsDirty();
  }

  public getCurrentOptionsFormArray(): FormArray {
    return this._form.get('options') as FormArray;
  }

  drop(event: CdkDragDrop<string[]>, form: string): void {
    moveItemInArray(this.getFormArray(form).controls, event.previousIndex, event.currentIndex);
  }

  getFormArray(form: string): FormArray {
    return this._form.get(form) as FormArray;
  }
}
