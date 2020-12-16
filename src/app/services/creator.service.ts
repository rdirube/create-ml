import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Option, Showable} from '../models/types';

@Injectable({
  providedIn: 'root'
})
export abstract class CreatorService {

  protected constructor(private _formBuilder: FormBuilder) {
  }

  public makeOptionForm(option?: Option, isCorrect = false): FormGroup {
    return this._formBuilder.group({
      id: [option ? option.id : 0],
      showable: this.makeShowableForm(option ? option.showable : undefined),
      isCorrect: [option ? option.isCorrect : isCorrect],
    });
  }

  public makeShowableForm(data?: Showable): FormGroup {
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

  public abstract addControls(data: any, form: FormGroup): void;


  public atLeastOneProp(form: FormArray): { atLeastOneProp: boolean } {
    return (form.value && form.value.map(x => x.showable).every(x => validProp(x.audio)
      || validProp(x.text) || validProp(x.image))) ? null : {
      atLeastOneProp: true
    };
  }
  public atLeastOnePropShowable(form: FormArray): { atLeastOnePropShowable: boolean } {
    return (form.value && form.value.every(x => validProp(x.audio)
      || validProp(x.text) || validProp(x.image))) ? null : {
      atLeastOnePropShowable: true
    };
  }
}

export function validProp(prop): boolean {
  return prop !== undefined && (prop.length || prop.data);
}
export function oneValidPropValidator(control: FormGroup): ValidationErrors | null  {
  const audio = control.get('audio').value;
  const image = control.get('image').value;
  const text = control.get('text').value;
  return (validProp(audio) || validProp(image) || validProp(text)) ? null : { onePropValid: true };
}
