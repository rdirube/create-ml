import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit {


  @Input() public form: FormGroup;
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
        imgPh = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReYPlsZ5_t7DNpRc825jM7IY62CdkBoo1MzdqMUXSgXF-HCicrzJODxCe9pFvu0DcbJTzWhy0gLeCCjLhxm9HsBlVxEF_ob-w&usqp=CAU&ec=45732301';
        break;
      case 'circus':
        imgPh = 'https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2019/08/carpa-circo.jpg';
        break;
      case 'boat':
        imgPh = 'https://noticiasdecruceros.com/wp-content/uploads/2018/07/Oriana-e1530821903775.jpg';
        break;
    }
    this.form.get('host').patchValue(imgPh);
    // this.form.get('host').patchValue(imagePath);
    this.form.get('host').markAsDirty();
  }


}
