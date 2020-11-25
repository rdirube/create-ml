import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {UploadOutput} from 'ngx-uploader';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ShowableProperty} from '../../models/types';

@Component({
  selector: 'app-showable-form',
  templateUrl: './showable-form.component.html',
  styleUrls: ['./showable-form.component.scss']
})
export class ShowableFormComponent implements OnInit {

  private _form: FormGroup;
  get form(): FormGroup {
    return this._form;
  }

  // @Input()
  set form(value: FormGroup) {
    this._form = value;
    // this.currentShowableType = this._form.get('showableTypes').value
    //   .map( x => this.showableTypes.find(e => e.value === x.type).name).join(', ');
    // this.currentShowableType = this.showableTypes.find(e => e.value === this._form.get('type').value);
  }

  public showableTypes: { name: string, icon: string, value: string }[];
  public currentShowableType: { name: string, icon: string, value: string }[];
  toShow: string;
  @Input() withImage = true;
  @Input() withText = true;
  @Input() withAudio = true;

  constructor(private cdr: ChangeDetectorRef,
              private formBuilder: FormBuilder) {
    this.currentShowableType = [];
    this.form = this.formBuilder.group({
      image: '',
      text: '',
      audio: '',
      video: ''
    });
  }

  ngOnInit(): void {
    // this._form.get('showableTypes').valueChanges.subscribe(value => {
    // });
  }

  getCurrentStatementValueValue(): any {
    return -5;
    // return this._form.get('value').value;

  }

  getShowableValue(): string {
    if (!this.getCurrentStatementValueValue()) {
      return '';
    }
    switch (this.getCurrentStatementTypeValue()) {
      case 'text':
        return '';
      case 'image':
        return this.getCurrentStatementValueValue().data ? this.getCurrentStatementValueValue().data.base64 :
          this.getCurrentStatementValueValue();
      case 'video':
        return this.getCurrentStatementValueValue();
      case 'audio':
        return this.getCurrentStatementValueValue().data ? this.getCurrentStatementValueValue().data.base64 :
          this.getCurrentStatementValueValue();
    }
    return '';
  }

  clearStatementValue(): void {
    console.log(this._form.get('showableTypes').value);
    this.toShow = this.currentShowableType.map(x => x.name).join(', ');
    // this.currentShowableType = this._form.get('showableTypes').value
    //   .map( x => this.showableTypes.find(e => e.value === x).name).join(', ');
    // this._form.get('value').setValue('');
  }

  getCurrentStatementTypeValue(): any {
    return this._form.get('type').value;
  }

  uploadFile($event: UploadOutput): void {
    if ($event.type !== 'done' && $event.type !== 'addedToQueue') {
      return;
    }
    const nativeFile = $event.nativeFile || $event.file.nativeFile;
    if (nativeFile) {
      const reader = new FileReader();
      this._form.get('value').setValue('');
      reader.onload = (e) => {
        this._form.get('value').setValue({name: +new Date() + nativeFile.name, data: {file: nativeFile, base64: reader.result}});
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(nativeFile);
    }
  }

  updateShowableTypes(): void {
    this.toShow = this.currentShowableType.map(x => x.name).join(', ');
    this.currentShowableType.forEach(x => {
      console.log();
      const originalValue: ShowableProperty[] = this.form.get('showableTypes').value;
      const filtered = originalValue.filter(z => this.currentShowableType.some(st => z.type === st.value));
      this.currentShowableType.filter(z => !filtered.some(f => f.type === z.value)).forEach(z => {
        filtered.push({type: z.value as any, value: ''});
      });
      this.form.get('showableTypes').setValue(filtered);
    });
  }
}
