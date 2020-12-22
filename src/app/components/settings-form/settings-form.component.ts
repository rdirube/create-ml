import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {SequenceGameTheme} from '../../models/creators/sort-elements';
import {SortElementsCreator} from '../../services/creators/sort-elements-creator';
import {Creator} from '../../services/creators/creator';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit {

  public form: FormGroup;
  public creator: Creator<any, any, any>;

  @Input('form')
  set setForm(value: { form: FormGroup, creator: Creator<any, any, any> }) {
    this.creator = value.creator;
    this.themesInfo = this.creator.themeInfo;
    this.form = value.form;
    if (!this.form.get('theme') || !this.form.get('theme').value) {
      // this.updateTheme('circus');
    } else {
      this.setSrcImageByTheme(this.form.get('theme').value);
    }
  }

  @Input() public infoFormGroup: FormGroup;
  @Input() public exercisesQuantity: number;
  public triviaTypes: { name: string, value: 'classic' | 'test' }[];
  currentSrcByTheme: string;
  themesInfo: {
    theme: SequenceGameTheme,
    text: string
  }[];

  constructor() {
;
  }

  ngOnInit(): void {
    this.triviaTypes = [{name: 'Clásico', value: 'classic'}, {name: 'Examen', value: 'test'}];
    // console.log(this.form)
    // console.log(this.infoFormGroup)
  }

  updateTheme(theme: string): void {
    this.setSrcImageByTheme(theme);
    this.form.get('theme').patchValue(theme);
    this.form.get('theme').markAsDirty();
  }

  private setSrcImageByTheme(theme: string): void {
    this.currentSrcByTheme = this.creator.getSrcImageByTheme(theme as any);

  }
}
