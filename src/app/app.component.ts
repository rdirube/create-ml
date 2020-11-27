import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {ChoiceExercise, MueroPorSaberGame} from './models/types';

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
  gameConfig: MueroPorSaberGame;
  public gameForm: FormGroup;
  public settingsSubscription: Subscription;

  settingsFormGroup: FormGroup;
  public background: SafeStyle;

  onClickSendOutput(): void {
    this.testOutput.emit({
      something: 'this is something from creator'
    });
  }

  constructor(private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private cdr: ChangeDetectorRef) {
    this.currentChoice = 0;
    this.settingsFormGroup = this.formBuilder.group({
      triviaType: ['classic'],
      host: ['gauss'],
      isRandom: [false],
      goal: [6,
        [Validators.min(5), Validators.max(20), Validators.required]],
      /* minPlayers: [this.game.settings ? this.getSettingsPropertyValueOf('minPlayers', '1') : 1,
        [Validators.min(1), Validators.max(8), Validators.required]],
      maxPlayers: [this.game.settings ? this.getSettingsPropertyValueOf('maxPlayers', '8') : 8,
        [Validators.min(1), Validators.max(8), Validators.required]], */
    });
    this.gameConfig = {
      choices: [],
      settings: {
        goal: 10,
        host: 'gauss',
        randomOrder: false,
        type: 'classic',
      },
      resourceUid: '123'
    };
    this.choicesFormArray = this.formBuilder.array(this.gameConfig.choices.map((choice, index) => {
      const form = this.formBuilder.group({index: [index]});
      // this.mueroPorSaberService.addControls(choice, form);
      return form;
    }));
  }

  ngOnInit(): void {
    this.triviaTypes = [{name: 'Clásico', value: 'classic'}, {name: 'Examen', value: 'test'}];
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
      host: [this.gameConfig.settings.host],
      isRandom: [this.gameConfig.settings.randomOrder],
      goal: [this.gameConfig.settings.goal,
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
      language: ['ES-AR'],
      // level: [this.game.level || 1],
      description: ['game description', [Validators.required, Validators.maxLength(500)]]
    });
  }

  updateHost(imagePath: string): void {
    this.form.get('host').patchValue(imagePath);
    this.form.get('host').markAsDirty();
  }

  public addChoice(index?: number): void {
    if (index === undefined) {
      index = this.gameConfig.choices.length;
    }
    this.choicesFormArray.insert(index >= 0 ? index : this.choicesFormArray.length, this.formBuilder.group({
      index: [index || 0]
    }));
    const choice: ChoiceExercise = {
      options: [
        {isCorrect: true, elementsToShow: [{audio: '', image: '', text: '', video: ''}], id: 0},
        {isCorrect: false, elementsToShow: [{audio: '', image: '', text: '', video: ''}], id: 0}
      ],
      elementsToShow: [{audio: '', image: '', text: '', video: '', id: 0}],
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


  saveGameAndExit(): void {
    this.saveGame();
    // console.log('saveGameAndExit');
    // console.log('saveGameAndExit');
    // console.log('saveGameAndExit');
  }

  saveGame(): void {
    console.log('saveGame');
    console.log('saveGame');
    console.log('saveGame');
    console.log(this.gameConfig);
  }

  changeCurrentChoice(n: number): void {
    const temp = this.currentChoice + n;
    if (temp >= 0 && temp < this.choicesFormArray.length) {
      this.currentChoice = temp;
    }
  }
}

