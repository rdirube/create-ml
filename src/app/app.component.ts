import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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


  settingsFormGroup: FormGroup;


  onClickSendOutput(): void {
    this.testOutput.emit({
      something: 'this is something from creator'
    });
  }


  constructor(private _formBuilder: FormBuilder) {
    this.infoFormGroup = this._formBuilder.group({
      name: [' game name ', [Validators.required, Validators.maxLength(256)]],
      // todo validator de max peso
      image: [''],
      // tags: [this.game.tags || []],
      // language: [this.game.language || 'es'],
      // level: [this.game.level || 1],
      description: ['game description', [Validators.required, Validators.maxLength(500)]]
    });
    this.settingsFormGroup = this._formBuilder.group({
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
  }

  ngOnInit(): void {
    this.triviaTypes = [{name: 'Clásico', value: 'classic'}, {name: 'Examen', value: 'test'}];
  }

  updateHost(imagePath: string): void {
    this.form.get('host').patchValue(imagePath);
    this.form.get('host').markAsDirty();
  }

}
