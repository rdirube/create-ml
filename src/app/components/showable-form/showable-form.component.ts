import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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

  @ViewChild('audio') audio: ElementRef;
  @Input() mediaFilesAlreadyLoaded: Map<string, Observable<string>>;
  private _form: FormGroup;
  get form(): FormGroup {
    return this._form;
  }

  @Input()
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

  @Input() maxTextLength;

  private previousAudioValue: string;
  @Input() textArea = true;
  @Input() resourcesFields = true;
  constructor(private cdr: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              public sanitize: DomSanitizer) {
    this.currentShowableType = [];
  }

  ngOnInit(): void {
    // this.checkAudioLoaded();
  }

  private checkAudioLoaded(): void {
    console.log('checkAudioLoaded');
    if (this._form.get('audio').value?.data === undefined
      && this._form.get('audio').value.length > 0
      && this._form.get('audio').value !== this.previousAudioValue) {
      if (this.audio) {
        this.previousAudioValue = this._form.get('audio').value;
        (this.audio.nativeElement as HTMLAudioElement).load();
        console.log('Loading new audio');
      }
    }
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

  removeProp(prop: string): void {
    this.form.get(prop).setValue('');
  }

}
