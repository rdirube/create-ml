import {ChangeDetectorRef, Component, HostListener, Input, OnInit} from '@angular/core';
import {UploadOutput} from 'ngx-uploader';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-showable-form',
  templateUrl: './showable-form.component.html',
  styleUrls: ['./showable-form.component.scss']
})
export class ShowableFormComponent implements OnInit {

  @Input() mediaFilesAlreadyLoaded: Map<string, Observable<string>>;
  private _form: FormGroup;
  get form(): FormGroup {
    return this._form;
  }

  @Input()
  set form(value: FormGroup) {
    console.log('setting form in showable', value);
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

  public currentAudioTest: SafeResourceUrl;
  @Input() maxTextLength;

  constructor(private cdr: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              public sanitize: DomSanitizer) {
    this.currentShowableType = [];
    // this.form = this.formBuilder.group({
    //   image: '',
    //   text: '',
    //   audio: '',
    //   video: ''
    // });
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

  uploadFile($event: UploadOutput, prop: string): void {
    if ($event.type !== 'done' && $event.type !== 'addedToQueue') {
      return;
    }
    const nativeFile = $event.nativeFile || $event.file.nativeFile;
    if (nativeFile) {
      const reader = new FileReader();
      this._form.get(prop).setValue('');
      reader.onload = (e) => {
        this._form.get(prop).setValue({name: +new Date() + nativeFile.name, data: {file: nativeFile, base64: reader.result}});
        // this._form.get('image').setValue({name: +new Date() + nativeFile.name, data: {file: nativeFile, base64: reader.result}});
        // if (prop === 'audio') {
        //   this.currentAudioTest = this.sanitize.bypassSecurityTrustResourceUrl(this._form.get(prop).value.data.base64);
        // }
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(nativeFile);
    }
  }

  // updateShowableTypes(): void {
  //   this.toShow = this.currentShowableType.map(x => x.name).join(', ');
  //   this.currentShowableType.forEach(x => {
  //     console.log();
  //     const originalValue: ShowableProperty[] = this.form.get('showableTypes').value;
  //     const filtered = originalValue.filter(z => this.currentShowableType.some(st => z.type === st.value));
  //     this.currentShowableType.filter(z => !filtered.some(f => f.type === z.value)).forEach(z => {
  //       filtered.push({type: z.value as any, value: ''});
  //     });
  //     this.form.get('showableTypes').setValue(filtered);
  //   });
  // }
  removeProp(prop: string): void {
    this.form.get(prop).setValue('');
  }

  @HostListener('document:keydown', ['$event'])
  asdasda($event) {
    if ($event.key.toLowerCase() === 'p') {
      console.log(this.form);
    }
    if ($event.key.toLowerCase() === 'd') {
      console.log( 'detectChanges');
      this.cdr.detectChanges();
    }
    if ($event.key.toLowerCase() === 'c') {
      console.log( 'markAsPristine');
      this.form.markAsPristine();
    }
    if ($event.key.toLowerCase() === 'y') {
      console.log( 'markAsDirty');
      this.form.markAsDirty();
    }
    if ($event.key.toLowerCase() === 'g') {
      console.log( 'markAsPending');
      this.form.markAsPending();
    }
    if ($event.key.toLowerCase() === 'e') {
      this.form.get('image').setValue('https://www.gstatic.com/images/branding/product/2x/photos_96dp.png');
    }
    if ($event.key.toLowerCase() === 'n') {
      console.log( 'Printing el ng if');
      console.log( this.form);
      console.log( this.form.get('image').value);
      console.log( this.form.get('image').value.data);
      console.log( this.form.get('image').value.data ? this.form.get('image').value.data.base64
        :
        'https://www.gstatic.com/images/branding/product/2x/photos_96dp.png');


    }
  }

}
