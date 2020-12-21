import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LiftGame, LiftGameExercise, LiftGameTheme} from '../../models/creators/lift-game-creator';
import {MicroLessonResourceProperties, Resource} from 'ox-types';
import {Creator} from './creator';

@Injectable({
  providedIn: 'root'
})
export class LiftCreator extends Creator<LiftGame, LiftGameExercise, LiftGameTheme> {

  readonly statementTextMaxLength = 85;
  readonly patternPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/answer-hunter/pattern-answer-hunters.png';
  readonly logoPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/answer-hunter/answer-hunter.svg';
  readonly backgroundColour = '#e0d6c6';

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
    this.creatorType = 'answer-hunter';
    this.themeInfo = [
      {
        text: 'Circo',
        theme: 'circus'
      },
      {
        text: 'Barco',
        theme: 'boat'
      },
      {
        text: 'Laboratorio',
        theme: 'lab'
      }
    ];
  }


  public getSrcImageByTheme(theme: LiftGameTheme): string {
    const baseURl = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/answer-hunter/creator/theme-images/';
    switch (theme) {
      case 'lab':
        return baseURl + 'lab-theme.jpg';
      case 'circus':
        return baseURl + 'circus-theme.jpg';
      case 'boat':
        return baseURl + 'boat-theme.jpg';
    }
  }

  protected newExercise(): LiftGameExercise {
    return {
      options: [
        {isCorrect: true, showable: {audio: '', image: '', text: '', video: ''}, id: 0},
        {isCorrect: false, showable: {audio: '', image: '', text: '', video: ''}, id: 0}
      ],
      statement: {audio: '', image: '', text: '', video: '', id: 0},
      id: 0
    };
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
      exercises: customConfig.microLessonLevelConfigurations[0].sublevelConfigurations[0].exercises,
      resourceUid: resource.uid
    };
    this.initForms(resource);
  }

  public setNewGame(resource: Resource): void {
    resource.properties = {
      customConfig: undefined,
      format: 'answer-hunter', miniLessonVersion: 'with-custom-config-v2',
      miniLessonUid: 'Answer hunter'
    };
    (resource.properties as MicroLessonResourceProperties).url = 'https://ml-screen-manager.firebaseapp.com';
    resource.customTextTranslations = {es: {name: {text: ''}, description: {text: ''}, previewData: {path: ''}}};
    this.gameConfig = {
      exercises: [],
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
    form.addControl('options', this.formBuilder.array(data ? data.options.map(x =>
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

  private initForms(resource: Resource): void {
    this.initBasicInformation(resource);
    this.initChoicesInformation();
    this.initSettingsForm();
  }

  private initChoicesInformation(): void {
    this.choicesFormArray = this.formBuilder.array(this.gameConfig.exercises.map((choice, index) => {
      const form = this.formBuilder.group({index: [index]});
      this.addControls(choice, form);
      return form;
    }));
    if (this.choicesFormArray.controls.length === 0) {
      this.addChoice();
    }
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

  setFormsBeforeSave(resource: Resource): void {
    this.setInfoForm(resource);
    this.setChoicesForm();
    this.setSettingsForm();
  }

  private setSettingsForm(): void {
    this.gameConfig.settings.type = this.settingsFormGroup.get('triviaType').value;
    this.gameConfig.settings.randomOrder = this.settingsFormGroup.get('isRandom').value;
    this.gameConfig.settings.exerciseCount = +this.settingsFormGroup.get('exerciseCount').value;
    this.gameConfig.settings.theme = this.settingsFormGroup.get('theme').value;
  }

  private setChoicesForm(): void {
    this.gameConfig.exercises = this.choicesFormArray.controls.map((choiceForm, choiceIndex) => {
      return {options: choiceForm.get('options').value, id: 1, statement: choiceForm.get('statement').value};
    });
  }

  private setInfoForm(resource: Resource, textLanguage = 'es'): void {
    resource.customTextTranslations[textLanguage].name.text = this.infoFormGroup.get('name').value;
    // this.game.language = this.infoFormGroup.get('language').value;
    resource.customTextTranslations[textLanguage].description.text = this.infoFormGroup.get('description').value;
    if (this.infoFormGroup.get('image').value.data) {
      resource.customTextTranslations[textLanguage].previewData.path =
        'library/items/' + resource.uid + '/preview-image-es';
    }
  }

  getResourceCustomConfig(resource: Resource): {
    customConfig: any, filesToSave: { file: File, name: string }[], allMediaUtilized: string[]
  } {
    const filesToSave: { file: File, name: string }[] = this.getFilesToSave();
    const allMediaUtilized = this.getUsedMedia();
    const previousMedia = ((resource.properties as MicroLessonResourceProperties).customConfig?.customMedia || [])
      .filter(x => allMediaUtilized.includes(x));
    this.setChoicesForm();
    return {
      allMediaUtilized,
      filesToSave,
      customConfig: {
        customMedia: previousMedia.concat(filesToSave.map(x => x.name)),
        microLessonLevelConfigurations: [{
          types: [{mode: 'challenges', value: this.gameConfig.settings.exerciseCount}],
          minScore: 500,
          maxScore: 10000,
          sublevelConfigurations: [{
            exercises: this.gameConfig.exercises
          }],
          exercisesToUpSubLevel: [this.gameConfig.settings.exerciseCount]
        }], extraInfo: {
          gameUrl: 'https://lift-game-creator.firebaseapp.com/',
          theme: this.gameConfig.settings.theme,
          exerciseCase: 'created',
          randomOrder: this.gameConfig.settings.randomOrder,
          language: this.infoFormGroup.get('language').value
        }
      }
    };
  }

  protected getAllShowablesFormArray(): FormGroup[] {
    const showables = [];
    for (let i = 0; i < this.choicesFormArray.length; i++) {
      showables.push(this.choicesFormArray.at(i).get('statement') as FormGroup);
      const options: FormArray = (this.choicesFormArray.at(i).get('options') as FormArray);
      for (let j = 0; j < options.length; j++) {
        showables.push(options.at(j).get('showable') as FormGroup);
      }
    }
    return showables;
  }



}

