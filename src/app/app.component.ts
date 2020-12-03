import {ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {ChoiceExercise, LiftGame, LiftGameExercise, Showable} from './models/types';
import {MicroLessonResourceProperties, Resource, ResourceType} from 'ox-types';
import {CreatorService} from './services/creator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'create-ml';

  @Input() inputVar: string;
  @Output() testOutput = new EventEmitter<any>();

  @Input() public form: FormGroup;
  @Input() public infoFormGroup: FormGroup;
  @Input() public exercisesQuantity: number;
  public triviaTypes: { name: string, value: 'classic' | 'test' }[];
  public saving: boolean;
  currentChoice: number;
  choicesFormArray: FormArray;
  gameConfig: LiftGame;
  public gameForm: FormGroup;
  public settingsSubscription: Subscription;

  @Output() save: EventEmitter<{ resource: Resource, value: {name: string, file: File}[] }>; // ver files names, sino un array de objetos nombres y file
  @Output() loadMedia: EventEmitter<{ name: string, value: Observable<string> }[]>; // files names
  @Input('mediaFilesLoaded')
  set newMediaFilesLoaded(mediaFiles: { name: string, value: Observable<string> }[]) {
    // saber si esta en base 64 o url
    // cuando guarda pasar solo las de base 64
  }

  @Input('resource')
  set receivedResource(resource: Resource) {

  }

  private _resource: Resource;
  settingsFormGroup: FormGroup;
  @HostBinding('style.background')
  public background: SafeStyle;

  onClickSendOutput(): void {
    this.testOutput.emit({
      something: 'this is something from creator'
    });
  }

  constructor(private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private createService: CreatorService,
              private cdr: ChangeDetectorRef) {
    this.currentChoice = 0;
    this.save = new EventEmitter<{resource: Resource, value: {name: string, file: File}[]}>();
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
    this.triviaTypes = [{name: 'Clásico', value: 'classic'}, {name: 'Examen', value: 'test'}];
    this.currentChoice = 0;
    // this.activatedRoute.paramMap.pipe(take(1)).subscribe(e => {
    //   const triviaId = e.get('triviaId');
    // this.triviaTypes = [{id: 1, name: '', requiredPropertyTypes: []}];
    // if (triviaId) {
    // this.loadTrivia(triviaId);
    // } else {
    this.setNewGame();
    this.initForms();
    // }
    // });
    this.background = this.sanitizer.bypassSecurityTrustStyle(
      '#365074 url("https://storage.googleapis.com/common-ox-assets/mini-lessons/muero-por-saber/stars.jpg") repeat'
    );
  }

  private setNewGame(): void {
    const properties: MicroLessonResourceProperties = {
      customConfig: undefined, format: 'lift-game', miniLessonVersion: 'creation',
      miniLessonUid: 'Lift game'
    };
    const customTextTranslations = {es: {name: {text: ''}, description: {text: ''}, previewData: {path: ''}}};
    const idTest = '12312';
    const ownerUidTest = 'owid';
    this._resource = {
      supportedLanguages: {es: true, en: false},
      isPublic: false, ownerUid: ownerUidTest, // this.authService.currentUser.uid,
      uid: idTest, // this.mueroPorSaberService.createId()
      inheritedPedagogicalObjectives: [], properties,
      customTextTranslations, backupReferences: '', type: ResourceType.MiniLesson, libraryItemType: 'resource', tagIds: {},
    };
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
    // this.game.choices = [];
    this.initForms();
  }


  private initForms(): void {
    this.initBasicInformation();
    this.initChoicesInformation();
    this.initSettingsForm();
    this.gameForm = this.formBuilder.group({
      basic: this.infoFormGroup,
      exercises: this.choicesFormArray,
      settings: this.settingsFormGroup
    });
    this.cdr.detectChanges();
  }

  private initSettingsForm(): void {
    this.settingsFormGroup = this.formBuilder.group({
      triviaType: [this.gameConfig.settings.type],
      theme: ['boat'],
      isRandom: [this.gameConfig.settings.randomOrder],
      exerciseCount: [this.gameConfig.settings.exerciseCount,
        [Validators.min(5), Validators.max(20), Validators.required]],
    });
    this.settingsSubscription = this.settingsFormGroup.valueChanges.subscribe((e) => {
      this.background = this.sanitizer.bypassSecurityTrustStyle(
        '#365074 url("https://storage.googleapis.com/common-ox-assets/mini-lessons/muero-por-saber/stars.jpg") repeat'
      );
    });
  }

  private initChoicesInformation(): void {
    // this.choicesFormArray.insert(0, this.formBuilder.group({
    //   index: [0]
    // }));
    if (this.choicesFormArray.controls.length === 0) {
      this.addChoice();
    }
  }

  private initBasicInformation(): void {
    this.infoFormGroup = this.formBuilder.group({
      name: [' game name ', [Validators.required, Validators.maxLength(256)]],
      // todo validator de max peso
      image: [''],
      // tags: [this.game.tags || []],
      language: ['ESP'],
      // level: [this.game.level || 1],
      description: ['game description', [Validators.required, Validators.maxLength(500)]]
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
    // console.log('saveGameAndExit');
    // console.log('saveGameAndExit');
    // console.log('saveGameAndExit');
  }

  private getFilesFromPropAndSetName(showable: Showable): {file: File, name: string}[] {
    const files = [];
    if ((showable.audio as any).data !== undefined) {
      files.push({file: (showable.audio as any).data.file, name: (showable.audio as any).name});
      showable.audio = (showable.audio as any).name;
    }
    if ((showable.image as any).data !== undefined) {
      files.push({file: (showable.image as any).data.file, name: (showable.image as any).name});
      showable.image = (showable.image as any).name;
    }
    return files;
  }

  saveGame(): void {
    console.log('saveGame');
    const toUpload: { info: { type: 'options' | 'statement' | 'cover', fileName: string }, file: File }[] = [];
    this.setInfoForm(toUpload);
    this.setChoicesForm(toUpload);
    this.setSettingsForm();
    const filesToSave: {file: File, name: string}[] = [].concat(...[].concat(...this.gameConfig.choices
      .map(x => [x.statement].concat(x.options.map(opt => opt.showable))))
      .map(x => this.getFilesFromPropAndSetName(x)));
    (this._resource.properties as MicroLessonResourceProperties).customConfig = {
      microLessonLevelConfigurations: [{
        types: [{mode: 'challenges', value: this.gameConfig.settings.exerciseCount}],
        minScore: 500,
        maxScore: 10000,
        sublevelConfigurations: [],
        exercisesToUpSubLevel: [this.gameConfig.settings.exerciseCount]
      }], extraInfo: {
        theme: this.gameConfig.settings.theme, exerciseCase: 'created',
        exercisesInOrder: this.gameConfig.choices,
        randomOrder: this.gameConfig.settings.randomOrder
      }
    };
    this.save.emit({resource: this._resource, value: filesToSave});
    console.log(JSON.stringify((this._resource.properties as MicroLessonResourceProperties).customConfig));
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
    // this.gameConfig.choices = this.choicesFormArray.controls.map((choiceForm, choiceIndex) => {
    //   return { options: choiceForm.get('options'), id: 1, statement: choiceForm.get('statement')};
    // });
    // this.gameConfig.choices = this.choicesFormArray.controls.map((choiceForm, choiceIndex) => {
    //   return this.makeChoiceExercise(choiceForm, toUpload);
    // });
  }

  private setInfoForm(toUpload: { info: { type: 'options' | 'statement' | 'cover', fileName: string }, file: File }[]): void {
    // this.gam.level = this.infoFormGroup.get('level').value;
    this._resource.customTextTranslations.es.name.text = this.infoFormGroup.get('name').value;
    // this.game.language = this.infoFormGroup.get('language').value;
    this._resource.customTextTranslations.es.description.text = this.infoFormGroup.get('description').value;
    if (this.infoFormGroup.get('image').value.data) {
      const file = this.infoFormGroup.get('image').value.data.file;
      const fileName = 'file name';
      // const fileName = this.getFileName(file);
      toUpload.push({
        info: {type: 'cover', fileName},
        file
      });
      this._resource.customTextTranslations.es.previewData.path = 'library/items/' + this._resource.uid + '/preview-image-es';
      // this.game.image = fileName;
    } else {
      // this.parseShowableValue('image', this.infoFormGroup.get('image').value);
      // this.game.image = this.parseShowableValue('image', this.infoFormGroup.get('image').value);
    }
  }
}

