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
  set setForm(form: FormGroup){
    this.form = form;
    this.updateHost('circus');
  }
  @Input() public infoFormGroup: FormGroup;
  @Input() public exercisesQuantity: number;
  public triviaTypes: { name: string, value: 'classic' | 'test' }[];

  constructor() {
  }

  ngOnInit(): void {
    this.triviaTypes = [{name: 'Clásico', value: 'classic'}, {name: 'Examen', value: 'test'}];
  }

  updateHost(imagePath: string): void {
    let imgPh;
    switch (imagePath) {
      case 'lab':
        imgPh = 'assets/lab-theme.jpg';
        break;
      case 'circus':
        imgPh = 'assets/circus-theme.jpg';
        break;
      case 'boat':
        imgPh = 'assets/boat-theme.jpg';
        break;
    }
    this.form.get('host').patchValue(imgPh);
    // this.form.get('host').patchValue(imagePath);
    this.form.get('host').markAsDirty();
    // this.cdr.detectChanges();
  }


}
