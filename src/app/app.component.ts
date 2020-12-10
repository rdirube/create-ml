import {ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, of, Subscription, timer} from 'rxjs';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {ChoiceExercise, LiftGame, LiftGameExercise, Showable} from './models/types';
import {MicroLessonResourceProperties, Resource, ResourceType} from 'ox-types';
import {CreatorService} from './services/creator.service';
import {reflectObjectLiteral} from '@angular/compiler-cli/src/ngtsc/reflection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'create-ml';

  private transLanguage = 'es';

  public form: FormGroup;
  public infoFormGroup: FormGroup;
  public exercisesQuantity: number;
  public saving: boolean;
  currentChoice: number;
  choicesFormArray: FormArray;
  gameConfig: LiftGame;
  public gameForm: FormGroup;
  public settingsSubscription: Subscription;

  @Output() save: EventEmitter<{ resource: Resource, value: { name: string, file: File }[] }>
    = new EventEmitter<{ resource: Resource, value: { name: string, file: File }[] }>();
  // ver files names, sino un array de objetos nombres y file
  @Output() loadMedia: EventEmitter<{ name: string, value: Observable<string> }[]>
    = new EventEmitter<{ name: string, value: Observable<string> }[]>(); // files names
  @Input()
  set mediaFilesLoaded(mediaFiles: { name: string, value: Observable<string> }[]) {
    console.log('media files loaded', mediaFiles);
    mediaFiles.forEach(x => {
      this.mediaFilesAlreadyLoaded.set(x.name, x.value);
    });
  }

  public mediaFilesAlreadyLoaded: Map<string, Observable<string>> =
    new Map<string, Observable<string>>();

  @Input()
  set receivedResource(resource: Resource) {
    console.log('Me llego resource', resource);
    console.log(JSON.parse(JSON.stringify(resource)));
    console.log(JSON.stringify(resource));
    this._resource = resource;
    if (!resource.properties) {
      console.log('creating game');
      this.setNewGame();
    } else {
      console.log('loading game');
      this.loadGame();
    }
  }

  private _resource: Resource;
  settingsFormGroup: FormGroup;
  @HostBinding('style.background')
  public background: SafeStyle;

  constructor(private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private createService: CreatorService,
              private cdr: ChangeDetectorRef) {
    this.currentChoice = 0;
    this.settingsFormGroup = this.formBuilder.group({
      triviaType: ['classic'],
      theme: ['boat'],
      isRandom: [false],
      exerciseCount: [6,
        [Validators.min(5), Validators.max(20), Validators.required]],
      /* minPlayers: [this.game.settings ? this.getSettingsPropertyValueOf('minPlayers', '1') : 1,
        [Validators.min(1), Validators.max(8), Validators.required]],
      maxPlayers: [this.game.settings ? this.getSettingsPropertyValueOf('maxPlayers', '8') : 8,
        [Validators.min(1), Validators.max(8), Validators.required]], */
    });
    this.gameConfig = {
      choices: [],
      settings: {
        exerciseCount: 10,
        randomOrder: false,
        type: 'classic',
        theme: 'boat'
      },
      resourceUid: '123'
    };
    this.choicesFormArray = this.formBuilder.array(this.gameConfig.choices.map((choice, index) => {
      const form = this.formBuilder.group({index: [index]});
      this.createService.addControls(choice, form);
      return form;
    }));
  }


  ngOnInit(): void {

    // timer(1000).subscribe( x => {
    //   const asd = {"ownerUid":"oQPbggIFzLcEHuDjp5ZNbkkVOlZ2","libraryItemType":"resource","customTextTranslations":{"es":{"previewData":{"path":""},"name":{"text":" game name "},"description":{"text":"game description"}}},"tagIds":{},"properties":{"format":"lift-game","miniLessonVersion":"with-custom-config-v2","customConfig":{"extraInfo":{"theme":"assets/boat-theme.jpg","exerciseCase":"created","gameUrl":"https://ml-creators.firebaseapp.com","randomOrder":true},"microLessonLevelConfigurations":[{"sublevelConfigurations":[{"exercises":[{"options":[{"showable":{"image":"","id":0,"video":"","audio":"","text":"Correcta"},"isCorrect":true,"id":0},{"showable":{"audio":"","text":"Incorrecta 1","video":"","id":0,"image":""},"isCorrect":false,"id":0},{"id":0,"isCorrect":false,"showable":{"id":0,"image":"","text":"Incorrecta 2","video":"","audio":""}}],"statement":{"image":"","id":0,"audio":"","video":"","text":"Un titulo"},"id":1},{"id":1,"statement":{"audio":"","text":"Imagen","id":0,"video":"","image":"1607600206040image-placeholder3.png"},"options":[{"isCorrect":false,"showable":{"image":"1607600219155record-audio-icon.png","text":"","video":"","audio":"","id":0},"id":0},{"showable":{"id":0,"video":"","text":"","image":"1607600222772lab-theme.jpg","audio":""},"id":0,"isCorrect":false},{"isCorrect":true,"id":0,"showable":{"text":"","video":"","image":"1607600233792image-placeholder3.png","id":0,"audio":""}}]}]}],"minScore":500,"maxScore":10000,"types":[{"value":2,"mode":"challenges"}],"exercisesToUpSubLevel":[2]}],"customMedia":["1607600206040image-placeholder3.png","1607600219155record-audio-icon.png","1607600222772lab-theme.jpg","1607600233792image-placeholder3.png"]},"miniLessonUid":"Lift game","url":"https://ml-screen-manager.firebaseapp.com"},"uid":"1Sf6zNAUJSsIX6s8iBqw","isPublic":false,"type":"mini-lesson","backupReferences":"","supportedLanguages":{"es":true,"en":false},"inheritedPedagogicalObjectives":[]};
    //   this.receivedResource = asd as Resource;
    //   console.log('Forcing send resource')
    // });

    this.currentChoice = 0;
    this.background = this.sanitizer.bypassSecurityTrustStyle(
      '#e0d6c6 url("https://storage.googleapis.com/common-ox-assets/mini-lessons/answer-hunter/pattern-answer-hunters.png") repeat'
    );
  }

  private setNewGame(): void {
    this._resource.properties = {
      customConfig: undefined,
      format: 'lift-game', miniLessonVersion: 'with-custom-config-v2',
      miniLessonUid: 'Lift game'
    };
    (this._resource.properties as MicroLessonResourceProperties).url = 'https://ml-screen-manager.firebaseapp.com';
    this._resource.customTextTranslations = {es: {name: {text: ''}, description: {text: ''}, previewData: {path: ''}}};
    this.gameConfig = {
      choices: [],
      settings: {
        exerciseCount: 10,
        randomOrder: false,
        type: 'classic',
        theme: 'boat'
      },
      resourceUid: this._resource.uid
    };
    (this._resource.properties as MicroLessonResourceProperties).customConfig = this.gameConfig;
    this.initForms();
  }


  private initForms(): void {
    console.log('initBasicInformation');
    this.initBasicInformation();
    console.log('initChoicesInformation');
    this.initChoicesInformation();
    console.log('initSettingsForm');
    this.initSettingsForm();
    console.log('gameForm');
    this.gameForm = this.formBuilder.group({
      basic: this.infoFormGroup,
      exercises: this.choicesFormArray,
      settings: this.settingsFormGroup
    });
    console.log('detectChanges');
    this.cdr.detectChanges();
    console.log('finish loading');
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

  private initChoicesInformation(): void {
    // this.choicesFormArray.insert(0, this.formBuilder.group({
    //   index: [0]
    // }));
    this.choicesFormArray = this.formBuilder.array(this.gameConfig.choices.map((choice, index) => {
      const form = this.formBuilder.group({'index': [index] });
      this.createService.addControls(choice, form);
      return form;
    }));
    if (this.choicesFormArray.controls.length === 0) {
      this.addChoice();
    }
  }


  private initBasicInformation(): void {
    const extraInfo = (this._resource.properties as MicroLessonResourceProperties).customConfig.extraInfo;
    this.infoFormGroup = this.formBuilder.group({
      name: [this._resource.customTextTranslations[this.transLanguage].name.text, [Validators.required, Validators.maxLength(256)]],
      // todo validator de max peso
      image: [this._resource.customTextTranslations[this.transLanguage].previewData.path || ''],
      // tags: [this.game.tags || []],
      language: [extraInfo ? extraInfo.language : 'ESP'],
      // level: [this.game.level || 1],
      description: [this._resource.customTextTranslations[this.transLanguage].description.text,
        [Validators.required, Validators.maxLength(500)]]
    });
  }

  updateTheme(imagePath: string): void {
    this.form.get('theme').patchValue(imagePath);
    this.form.get('theme').markAsDirty();
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
    this.cdr.detectChanges();
  }

  removeChoice(index: number): void {
    /*    const id = this.choicesFormArray.controls[index].get('id').value;
        if (id) {
          this.game.removedChoiceIds.push(id);
        }*/
    this.choicesFormArray.markAsDirty();
    this.choicesFormArray.removeAt(index);
    if (this.currentChoice >= this.choicesFormArray.controls.length) {
      this.currentChoice = this.choicesFormArray.length - 1;
    }
  }

  changeCurrentChoice(n: number): void {
    const temp = this.currentChoice + n;
    if (temp >= 0 && temp < this.choicesFormArray.length) {
      this.currentChoice = temp;
    }
  }

  saveGameAndExit(): void {
    this.saveGame();
  }

  saveGame(): void {
    const toUpload: { info: { type: 'options' | 'statement' | 'cover', fileName: string }, file: File }[] = [];
    const filesToSave: { file: File, name: string }[] = this.getFilesToSave();
    this.setInfoForm(toUpload);
    this.setChoicesForm(toUpload);
    this.setSettingsForm();
    (this._resource.properties as MicroLessonResourceProperties).customConfig = {
      customMedia: filesToSave.map(x => x.name),
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
    };
    this.save.emit({resource: this._resource, value: filesToSave});
  }

  private setSettingsForm(): void {
    this.gameConfig.settings.type = this.settingsFormGroup.get('triviaType').value;
    this.gameConfig.settings.randomOrder = this.settingsFormGroup.get('isRandom').value;
    this.gameConfig.settings.exerciseCount = +this.settingsFormGroup.get('exerciseCount').value;
    this.gameConfig.settings.theme = this.settingsFormGroup.get('theme').value;
  }

  private setChoicesForm(toUpload: { info: { type: 'options' | 'statement' | 'cover', fileName: string }, file: File }[]): void {
    // this.gameConfig.choices = [];
    this.gameConfig.choices = this.choicesFormArray.controls.map((choiceForm, choiceIndex) => {
      return {options: choiceForm.get('options').value, id: 1, statement: choiceForm.get('statement').value};
    });
  }

  private setInfoForm(toUpload: { info: { type: 'options' | 'statement' | 'cover', fileName: string }, file: File }[]): void {
    // this.gam.level = this.infoFormGroup.get('level').value;
    this._resource.customTextTranslations[this.transLanguage].name.text = this.infoFormGroup.get('name').value;
    // this.game.language = this.infoFormGroup.get('language').value;
    this._resource.customTextTranslations[this.transLanguage].description.text = this.infoFormGroup.get('description').value;
    if (this.infoFormGroup.get('image').value.data) {
      const file = this.infoFormGroup.get('image').value.data.file;
      const fileName = 'file name';
      // const fileName = this.getFileName(file);
      toUpload.push({
        info: {type: 'cover', fileName},
        file
      });
      this._resource.customTextTranslations[this.transLanguage].previewData.path = 'library/items/' + this._resource.uid + '/preview-image-es';
      // this.game.image = fileName;
    } else {
      // this.parseShowableValue('image', this.infoFormGroup.get('image').value);
      // this.game.image = this.parseShowableValue('image', this.infoFormGroup.get('image').value);
    }
  }

  private getFilesToSave(): { file: File, name: string }[] {
    const files = [];
    for (let i = 0; i < this.choicesFormArray.length; i++) {
      this.getFilesFromPropAndSetName(this.choicesFormArray.at(i).get('statement') as FormGroup).forEach(x => files.push(x));
      const options: FormArray = (this.choicesFormArray.at(i).get('options') as FormArray);
      for (let j = 0; j < options.length; j++) {
        this.getFilesFromPropAndSetName(options.at(j).get('showable') as FormGroup).forEach(x => {
          files.push(x);
        });
      }
    }
    return files;
  }

  private getFilesFromPropAndSetName(showable: FormGroup): { file: File, name: string }[] {
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

  private loadGame(): void {
    const customConfig = (this._resource.properties as MicroLessonResourceProperties).customConfig;
    this.loadMedia.emit(customConfig.customMedia.map( x => {
      return {name: x};
    }));
    console.log('sending medioa to load', customConfig.customMedia.map( x => {
      return {name: x};
    }));
    this.gameConfig = {
      settings: {
        exerciseCount: customConfig.microLessonLevelConfigurations[0].exercisesToUpSubLevel[0],
        randomOrder: customConfig.extraInfo.randomOrder,
        theme: customConfig.extraInfo.theme,
        type: 'classic'
      },
      choices: customConfig.microLessonLevelConfigurations[0].sublevelConfigurations[0].exercises,
      resourceUid: this._resource.uid
    };
    console.log('loaded config', this.gameConfig);
    this.initForms();
  }
}

