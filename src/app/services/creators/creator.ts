import {FormArray, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Option, Showable, ThemeInfo} from '../../models/types';
import {MicroLessonResourceProperties, Resource} from 'ox-types';
import {Game} from '../../models/creators/lift-game-creator';


export abstract class Creator<GameCfg extends Game<GameExercise, any>, GameExercise, Themes> {

  public infoFormGroup: FormGroup;
  choicesFormArray: FormArray;
  settingsFormGroup: FormGroup;
  currentChoice: number;
  gameConfig: GameCfg;
  public abstract readonly statementTextMaxLength;
  public optionTextMaxLength = 12;
  public abstract readonly patternPath;
  public abstract readonly logoPath;
  public abstract readonly backgroundColour;

  themeInfo: ThemeInfo<Themes>[];
  public creatorType: 'answer-hunter' | 'sort-elements' | 'memotest' | 'join-with-arrows';
  canAddExercises = true;

  protected constructor(protected formBuilder: FormBuilder) {
  }


  public abstract getSrcImageByTheme(theme: Themes): string;

  public makeOptionForm(option?: Option, isCorrect = false): FormGroup {
    return this.formBuilder.group({
      id: [option ? option.id : 0],
      showable: this.makeShowableForm(option ? option.showable : undefined),
      isCorrect: [option ? option.isCorrect : isCorrect],
    });
  }


  public makeShowableForm(data?: Showable): FormGroup {
    return this.formBuilder.group({
      id: [data ? data.id : 0],
      audio: data ? data.audio : '',
      image: data ? data.image : '',
      text: [data ? data.text : ''],
      video: data ? data.video : ''
      // showableTypes: [data ? data : [{audio: '', image: '', text: '', video: ''}], Validators.required],
      // value: [data ? data.value : '', [Validators.required, Validators.maxLength(256)]],
    }, {validators: oneValidPropValidator});
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

  protected initBasicInformation(resource: Resource, textLanguage = 'es'): void {
    const extraInfo = (resource.properties as MicroLessonResourceProperties).customConfig?.extraInfo || undefined;
    this.infoFormGroup = this.formBuilder.group({
      name: [resource.customTextTranslations[textLanguage].name.text, [Validators.required, Validators.maxLength(256)]],
      // todo validator de max peso
      image: [resource.customTextTranslations[textLanguage].previewData.path || ''],
      // tags: [this.game.tags || []],
      language: [extraInfo ? extraInfo.language : 'ESP'],
      // level: [this.game.level || 1],
      description: [resource.customTextTranslations[textLanguage].description.text,
        [Validators.required, Validators.maxLength(500)]]
    });
  }

  public addChoice(index?: number): void {
    if (index === undefined) {
      index = this.choicesFormArray.length;
    }
    this.choicesFormArray.insert(index >= 0 ? index : this.choicesFormArray.length, this.formBuilder.group({
      index: [index || 0]
    }));
    const choice: GameExercise = this.newExercise();
    this.gameConfig.exercises = this.gameConfig.exercises.slice(0, index).concat([choice]).concat(this.gameConfig.exercises.slice(index));
    this.currentChoice = index >= 0 ? index : (this.choicesFormArray.length - 1);
  }


  public removeChoice(index: number): void {
    this.choicesFormArray.markAsDirty();
    this.choicesFormArray.removeAt(index);
    if (this.currentChoice >= this.choicesFormArray.controls.length) {
      this.currentChoice = this.choicesFormArray.length - 1;
    }
  }

  protected getFilesToSave(): { file: File, name: string }[] {
    const showables: FormGroup[] = this.getAllShowablesFormArray();
    const files = [];
    showables.forEach(x => {
      getFilesFromPropAndSetName(x).forEach(m => files.push(m));
    });
    return files;
    // for (let i = 0; i < this.choicesFormArray.length; i++) {
    //   getFilesFromPropAndSetName(this.choicesFormArray.at(i).get('statement') as FormGroup).forEach(x => files.push(x));
    //   const options: FormArray = (this.choicesFormArray.at(i).get('options') as FormArray);
    //   for (let j = 0; j < options.length; j++) {
    //     getFilesFromPropAndSetName(options.at(j).get('showable') as FormGroup).forEach(x => {
    //       files.push(x);
    //     });
    //   }
    // }
    // return files;
  }

  protected getUsedMedia(): string[] {
    const showables: FormGroup[] = this.getAllShowablesFormArray();
    const media = [];
    showables.forEach(x => {
      getMediaUrlsFromShowable(x).forEach(m => media.push(m));
    });
    return media;
    // for (let i = 0; i < this.choicesFormArray.length; i++) {
    //   getMediaUrlsFromShowable(this.choicesFormArray.at(i).get('statement') as FormGroup)
    //     .forEach(x => media.push(x));
    //   const options: FormArray = (this.choicesFormArray.at(i).get('options') as FormArray);
    //   for (let j = 0; j < options.length; j++) {
    //     getMediaUrlsFromShowable(options.at(j).get('showable') as FormGroup).forEach(x => {
    //       media.push(x);
    //     });
    //   }
    // }
    // return media;
  }

  protected abstract newExercise(): GameExercise;

  protected abstract getAllShowablesFormArray(): FormGroup[];

  public abstract setNewGame(resource: Resource): void;

  public abstract loadGame(resource: Resource): void;

  public abstract setFormsBeforeSave(resource: Resource): void;

  public abstract getResourceCustomConfig(resource: Resource): {
    customConfig: any, filesToSave: { file: File, name: string }[], allMediaUtilized: string[]
  };

  makeRelationForm(data: any): FormArray {
    return this.formBuilder.array(data.relation
      ? data.relation.map(r => this.makeShowableForm(r))
      : [], Validators.compose([this.atLeastOnePropShowable]));
  }
}

export function validProp(prop): boolean {
  return prop !== undefined && (prop.length || prop.data);
}

export function oneValidPropValidator(control: FormGroup): ValidationErrors | null {
  const audio = control.get('audio').value;
  const image = control.get('image').value;
  const text = control.get('text').value;
  return (validProp(audio) || validProp(image) || validProp(text)) ? null : {onePropValid: true};
}

export function getMediaUrlsFromShowable(showable: FormGroup): { file: File, name: string }[] {
  const mediaUrls = [];
  if (showable.get('audio').value?.length && showable.get('audio').value.data === undefined) {
    mediaUrls.push(showable.get('audio').value);
  }
  if (showable.get('image').value?.length && showable.get('image').value.data === undefined) {
    mediaUrls.push(showable.get('image').value);
  }
  return mediaUrls;
}

export function getFilesFromPropAndSetName(showable: FormGroup): { file: File, name: string }[] {
  const files = [];
  if (showable.get('audio').value.data !== undefined) {
    files.push({file: showable.get('audio').value.data.file, name: showable.get('audio').value.name});
    showable.get('audio').setValue(showable.get('audio').value.name);
  }
  if (showable.get('image').value.data !== undefined) {
    files.push({file: showable.get('image').value.data.file, name: showable.get('image').value.name});
    showable.get('image').setValue(showable.get('image').value.name);
  }
  return files;
}
