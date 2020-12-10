import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit {


  public form: FormGroup;

  @Input('form')
  set setForm(form: FormGroup) {
    this.form = form;
    if (!form.get('theme') || !form.get('theme').value) {
      this.updateTheme('circus');
    } else {
      this.setSrcImageByTheme(form.get('theme').value);
    }
  }

  @Input() public infoFormGroup: FormGroup;
  @Input() public exercisesQuantity: number;
  public triviaTypes: { name: string, value: 'classic' | 'test' }[];
  currentSrcByTheme: string;

  constructor() {
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
    const baseURl = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/answer-hunter/creator/theme-images/';
    switch (theme) {
      case 'lab':
        this.currentSrcByTheme = 'lab-theme.jpg';
        break;
      case 'circus':
        this.currentSrcByTheme = 'circus-theme.jpg';
        break;
      case 'boat':
        this.currentSrcByTheme = 'boat-theme.jpg';
        break;
    }
    this.currentSrcByTheme = baseURl + this.currentSrcByTheme;
  }
}
