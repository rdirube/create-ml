import {Creator} from './creator';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MicroLessonFormatType, MicroLessonResourceProperties, Resource} from 'ox-types';
import {RelationsGame, RelationGameExercise} from '../../models/creators/memotest';

export abstract class RelationsCreator<GameTheme> extends Creator<RelationsGame<GameTheme>,
  RelationGameExercise, GameTheme> {

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);

  }

  protected newExercise(): RelationGameExercise {
    return {
      statement: {audio: '', image: '', text: '', video: '', id: 0},
      relations: [
        {
          relation: [
            {audio: '', image: '', text: '1', video: ''},
            {audio: '', image: '', text: '1', video: ''},
          ]
        }],
      traps: [],
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
      format: this.getFormat(), miniLessonVersion: 'with-custom-config-v2',
      miniLessonUid: this.getMiniLessonUid()
    };
    console.log('resource', resource, JSON.stringify(resource));
    (resource.properties as MicroLessonResourceProperties).url = 'https://ml-screen-manager.firebaseapp.com';
    resource.customTextTranslations =
      (resource.customTextTranslations && Object.keys(resource.customTextTranslations).length) ?
        resource.customTextTranslations
        : {es: {name: {text: ''}, description: {text: ''}, previewData: {path: ''}}};
    this.gameConfig = {
      exercises: [],
      settings: {
        exerciseCount: 10,
        randomOrder: false,
        type: 'classic',
        theme: this.themeInfo[0].theme as GameTheme
      },
      resourceUid: resource.uid
    };
    this.initForms(resource);
  }

  public addControls(data: RelationGameExercise, form: FormGroup): void {
    console.log('Adding RelationGameExercise', data);
    form.addControl('statement', this.makeShowableForm(data ? data.statement : undefined));
    form.addControl('relations', this.formBuilder.array(data ? data.relations.map(x =>
      this.formBuilder.array(x.relation.map(r => this.makeShowableForm(r)))) : []));
    form.addControl('traps', this.formBuilder.array(data ? data.traps : []));
    // this.formBuilder.array(x.relation.map( r => this.makeShowableForm(r)))) : [], Validators.compose([this.atLeastOnePropShowable])));
    // form.addControl('traps', this.formBuilder.array(data ? data.traps.map(x =>
    //   this.makeShowableForm(x)) : [], Validators.compose([this.atLeastOnePropShowable])));
    // const formArray = (form.get('relations') as FormArray);
    // if (!data) {
    //   formArray.push(this.makeOptionForm(undefined, true));
    //   formArray.push(this.makeOptionForm());
    // }
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
      return {
        relations: choiceForm.get('relations').value,
        traps: choiceForm.get('traps').value,
        id: 1, statement: choiceForm.get('statement').value
      };
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
              .map(exe => {
                return {
                  ...exe, relations: exe.relations.map(rel => {
                    return {relation: rel};
                  })
                };
              })
          }],
          exercisesToUpSubLevel: [this.gameConfig.settings.exerciseCount]
        }], extraInfo: {
          gameUrl: this.getGameURl(),
          theme: this.gameConfig.settings.theme,
          exerciseCase: 'created',
          randomOrder: this.gameConfig.settings.randomOrder,
          language: this.infoFormGroup.get('language').value
        }
      }
    };
  }

  protected getAllShowablesFormArray(): FormGroup[] {
    console.log('No se esta teniendo en cuenta tema trampas');
    const showables = [];
    for (let i = 0; i < this.choicesFormArray.length; i++) {
      showables.push(this.choicesFormArray.at(i).get('statement') as FormGroup);
      const relations: FormArray[] = (this.choicesFormArray.at(i).get('relations') as FormArray).controls as FormArray[];
      relations.map(x => x.controls)
        .forEach(value => {
          value.forEach(showable => {
            showables.push(showable);
          });
        });
      // const traps: FormArray = (this.choicesFormArray.at(i).get('traps') as FormArray);
      // for (let j = 0; j < traps.length; j++) {
      //   showables.push(traps.at(j) as FormGroup);
      // }
    }
    return showables;
  }

  protected abstract getGameURl(): string;
  protected abstract getFormat(): MicroLessonFormatType;
  protected abstract getMiniLessonUid(): string;

}
