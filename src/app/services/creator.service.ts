import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChoiceExercise, Option, Showable} from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class CreatorService {

  constructor(private _formBuilder: FormBuilder) {
  }

  public makeOptionForm(option?: Option, isCorrect = false): FormGroup {
    return this._formBuilder.group({
      id: [option ? option.id : 0],
      showable: this.createShowableFormGroup(option ? option.elementsToShow[0] : undefined),
      isCorrect: [option ? option.isCorrect : isCorrect],
    });
  }

  private createShowableFormGroup(data?: Showable): FormGroup {
    return this._formBuilder.group({
      id: [data ? data.id : 0],
      audio: data ? data.audio : '',
      image: data ? data.image : '',
      text: data ? data.text : '',
      video: data ? data.video : ''
      // showableTypes: [data ? data : [{audio: '', image: '', text: '', video: ''}], Validators.required],
      // value: [data ? data.value : '', [Validators.required, Validators.maxLength(256)]],
    });
  }

  public atLeastOneAnswerIsCorrect(form: FormArray): { atLeastOneAnswerIsCorrect: boolean } {
    return form.controls.find(e => e.get('isCorrect').value === true) ? null : {
      atLeastOneAnswerIsCorrect: true
    };
  }

  public addControls(data: ChoiceExercise, form: FormGroup): void {
    form.addControl('statement', this.createShowableFormGroup(data ? data.elementsToShow[0] : undefined));
    form.addControl('options', this._formBuilder.array([], Validators.compose([this.atLeastOneAnswerIsCorrect])));
    const formArray = (form.get('options') as FormArray);
    if (!data) {
      formArray.push(this.makeOptionForm(undefined, true));
      formArray.push(this.makeOptionForm());
    } else {
      data.options.forEach(option => {
        formArray.push(this.makeOptionForm(option));
      });
    }
  }


}
