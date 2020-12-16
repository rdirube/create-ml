import { Injectable } from '@angular/core';
import {CreatorService} from '../creator.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LiftGame, LiftGameExercise} from '../../models/creators/lift-game-creator';
import {MicroLessonResourceProperties, Resource} from 'ox-types';

@Injectable({
  providedIn: 'root'
})
export class LiftGameService extends CreatorService {

  public infoFormGroup: FormGroup;
  choicesFormArray: FormArray;
  settingsFormGroup: FormGroup;
  currentChoice: number;
  gameConfig: LiftGame;

  constructor(private formBuilder: FormBuilder) {
    super(formBuilder);
  }

  public loadGame(resource: Resource): void {
    const customConfig = (resource.properties as MicroLessonResourceProperties).customConfig;
    this.gameConfig = {
      settings: {
        exerciseCount: customConfig.microLessonLevelConfigurations[0].exercisesToUpSubLevel[0],
        randomOrder: customConfig.extraInfo.randomOrder,
        theme: customConfig.extraInfo.theme,
        type: 'classic'
      },
      choices: customConfig.microLessonLevelConfigurations[0].sublevelConfigurations[0].exercises,
      resourceUid: resource.uid
    };
    this.initForms(resource);
  }

  private setNewGame(resource: Resource): void {
    resource.properties = {
      customConfig: undefined,
      format: 'answer-hunter', miniLessonVersion: 'with-custom-config-v2',
      miniLessonUid: 'Answer hunter'
    };
    (resource.properties as MicroLessonResourceProperties).url = 'https://ml-screen-manager.firebaseapp.com';
    resource.customTextTranslations = {es: {name: {text: ''}, description: {text: ''}, previewData: {path: ''}}};
    this.gameConfig = {
      choices: [],
      settings: {
        exerciseCount: 10,
        randomOrder: false,
        type: 'classic',
        theme: 'boat'
      },
      resourceUid: resource.uid
    };
    this.initForms(resource);
  }

  public addControls(data: LiftGameExercise, form: FormGroup): void {
    form.addControl('statement', this.makeShowableForm(data ? data.statement : undefined));
    form.addControl('options', this.formBuilder.array(data ? data.options.map( x =>
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

  public addChoice(index?: number): void {
    if (index === undefined) {
      index = this.gameConfig.choices.length;
    }
    this.choicesFormArray.insert(index >= 0 ? index : this.choicesFormArray.length, this.formBuilder.group({
      index: [index || 0]
    }));
    const choice: LiftGameExercise = {
      options: [
        {isCorrect: true, showable: {audio: '', image: '', text: '', video: ''}, id: 0},
        {isCorrect: false, showable: {audio: '', image: '', text: '', video: ''}, id: 0}
      ],
      statement: {audio: '', image: '', text: '', video: '', id: 0},
      id: 0
    };
    this.gameConfig.choices = this.gameConfig.choices.slice(0, index).concat([choice]).concat(this.gameConfig.choices.slice(index));
    this.currentChoice = index >= 0 ? index : (this.choicesFormArray.length - 1);
    // this.cdr.detectChanges();
  }

  private initForms(resource: Resource): void {
    this.initBasicInformation(resource);
    this.initChoicesInformation();
    this.initSettingsForm();
    // this.cdr.detectChanges();
  }

  private initChoicesInformation(): void {
    this.choicesFormArray = this.formBuilder.array(this.gameConfig.choices.map((choice, index) => {
      const form = this.formBuilder.group({index: [index]});
      this.addControls(choice, form);
      return form;
    }));
    if (this.choicesFormArray.controls.length === 0) {
      this.addChoice();
    }
  }

  private initBasicInformation(resource: Resource, textLanguage = 'es'): void {
    const extraInfo = (resource.properties as MicroLessonResourceProperties).customConfig.extraInfo;
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

  private initSettingsForm(): void {
    this.settingsFormGroup = this.formBuilder.group({
      triviaType: [this.gameConfig.settings.type],
      theme: [this.gameConfig.settings.theme],
      isRandom: [this.gameConfig.settings.randomOrder],
      exerciseCount: [this.gameConfig.settings.exerciseCount,
        [Validators.min(5), Validators.max(20), Validators.required]],
    });
  }
}
