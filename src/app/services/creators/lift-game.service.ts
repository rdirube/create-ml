import {Injectable} from '@angular/core';
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

  public setNewGame(resource: Resource): void {
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

  public removeChoice(index: number): void {
    this.choicesFormArray.markAsDirty();
    this.choicesFormArray.removeAt(index);
    if (this.currentChoice >= this.choicesFormArray.controls.length) {
      this.currentChoice = this.choicesFormArray.length - 1;
    }
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
    this.gameConfig.choices = this.choicesFormArray.controls.map((choiceForm, choiceIndex) => {
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
    const previousMedia = ((resource.properties as MicroLessonResourceProperties).customConfig.customMedia || [])
      .filter(x => allMediaUtilized.includes(x));
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
            exercises: this.gameConfig.choices
          }],
          exercisesToUpSubLevel: [this.gameConfig.settings.exerciseCount]
        }], extraInfo: {
          gameUrl: 'https://ml-creators.firebaseapp.com',
          theme: this.gameConfig.settings.theme,
          exerciseCase: 'created',
          randomOrder: this.gameConfig.settings.randomOrder,
          language: this.infoFormGroup.get('language').value
        }
      }
    };
  }


  private getFilesToSave(): { file: File, name: string }[] {
    const files = [];
    for (let i = 0; i < this.choicesFormArray.length; i++) {
      getFilesFromPropAndSetName(this.choicesFormArray.at(i).get('statement') as FormGroup).forEach(x => files.push(x));
      const options: FormArray = (this.choicesFormArray.at(i).get('options') as FormArray);
      for (let j = 0; j < options.length; j++) {
        getFilesFromPropAndSetName(options.at(j).get('showable') as FormGroup).forEach(x => {
          files.push(x);
        });
      }
    }
    return files;
  }

  public getUsedMedia(): string[] {
    const media = [];
    for (let i = 0; i < this.choicesFormArray.length; i++) {
      getMediaUrlsFromShowable(this.choicesFormArray.at(i).get('statement') as FormGroup)
        .forEach(x => media.push(x));
      const options: FormArray = (this.choicesFormArray.at(i).get('options') as FormArray);
      for (let j = 0; j < options.length; j++) {
        getMediaUrlsFromShowable(options.at(j).get('showable') as FormGroup).forEach(x => {
          media.push(x);
        });
      }
    }
    return media;
  }


}


function getMediaUrlsFromShowable(showable: FormGroup): { file: File, name: string }[] {
  const mediaUrls = [];
  if (showable.get('audio').value?.length && showable.get('audio').value.data === undefined) {
    mediaUrls.push(showable.get('audio').value);
  }
  if (showable.get('image').value?.length && showable.get('image').value.data === undefined) {
    mediaUrls.push(showable.get('image').value);
  }
  return mediaUrls;
}

function getFilesFromPropAndSetName(showable: FormGroup): { file: File, name: string }[] {
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
