import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {ChoiceExercise, LiftGameExercise, Option, Showable} from '../models/types';
import {log} from 'util';

@Injectable({
  providedIn: 'root'
})
export class CreatorService {

  constructor(private _formBuilder: FormBuilder) {
  }

  public makeOptionForm(option?: Option, isCorrect = false): FormGroup {
    return this._formBuilder.group({
      id: [option ? option.id : 0],
      showable: this.createShowableFormGroup(option ? option.showable : undefined),
      isCorrect: [option ? option.isCorrect : isCorrect],
    });
  }

  private createShowableFormGroup(data?: Showable): FormGroup {
    return this._formBuilder.group({
      id: [data ? data.id : 0],
      audio: data ? data.audio : '',
      image: data ? data.image : '',
      text: [data ? data.text : ''],
      video: data ? data.video : ''
      // showableTypes: [data ? data : [{audio: '', image: '', text: '', video: ''}], Validators.required],
      // value: [data ? data.value : '', [Validators.required, Validators.maxLength(256)]],
    }, { validators: oneValidPropValidator });
  }



  public atLeastOneAnswerIsCorrect(form: FormArray): { atLeastOneAnswerIsCorrect: boolean } {
    return form.controls.filter(e => e.get('isCorrect').value === true).length === 1 ? null : {
      atLeastOneAnswerIsCorrect: true
    };
  }

  public addControls(data: LiftGameExercise, form: FormGroup): void {
    form.addControl('statement', this.createShowableFormGroup(data ? data.statement : undefined));
    form.addControl('options', this._formBuilder.array(data ? data.options.map( x =>
      this.makeOptionForm(x)) : [], Validators.compose([this.atLeastOneAnswerIsCorrect, this.atLeastOneProp])));
    const formArray = (form.get('options') as FormArray);
    if (!data) {
      formArray.push(this.makeOptionForm(undefined, true));
      formArray.push(this.makeOptionForm());
    } else {
      // data.options.forEach(option => {
      //   formArray.push(this.makeOptionForm(option));
      // });
    }
  }


  public atLeastOneProp(form: FormArray): { atLeastOneProp: boolean } {
    // console.log('Testing... ', (form.get('options') && form.get('options').value.every(x => validProp(x.audio)
    //   || validProp(x.text) || validProp(x.image))));
    return (form.value && form.value.map(x => x.showable).every(x => validProp(x.audio)
      || validProp(x.text) || validProp(x.image))) ? null : {
      atLeastOneProp: true
    };
  }

}

function validProp(prop): boolean {
  return prop !== undefined && (prop.length || prop.data);
}
function oneValidPropValidator(control: FormGroup): ValidationErrors | null  {
  const audio = control.get('audio').value;
  const image = control.get('image').value;
  const text = control.get('text').value;
  return (validProp(audio) || validProp(image) || validProp(text)) ? null : { onePropValid: true };
}
