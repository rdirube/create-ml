import {ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, of, timer} from 'rxjs';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {MicroLessonResourceProperties, Resource} from 'ox-types';
import {MediaService} from './services/media.service';
import {LiftGameService} from './services/creators/lift-game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'create-ml';
  private textsLanguage = 'es';

  public gameForm: FormGroup;

  currentChoice: number;

  public saving: boolean;
  @Output() save: EventEmitter<{
    resource: Resource, value: {
      preview: { delete: boolean, file: File },
      exercises: { delete: string[], toUpload: { file: File, name: string }[] }
    }
  }>
    = new EventEmitter<{
    resource: Resource, value: {
      preview: { delete: boolean, file: File },
      exercises: { delete: string[], toUpload: { file: File, name: string }[] }
    }
  }>();
  @Output() loadMedia: EventEmitter<{ name: string, value: Observable<string> }[]>
    = new EventEmitter<{ name: string, value: Observable<string> }[]>();
  private thereWasPreviewImageBefore: boolean;
  @Input()
  set mediaFilesLoaded(mediaFiles: { name: string, value: Observable<string> }[]) {
    console.log('media files loaded', mediaFiles);
    mediaFiles.forEach(x => {
      this.mediaFilesAlreadyLoaded.set(x.name, x.value);
      if (x.name.includes('.mp3')) {
        x.value.subscribe(ss => {
          this.mediaService.audioFileLoaded.emit({name: x.name, value: ss});
        });
      }
    });
    this.mediaFilesAlreadyLoaded.get('preview-image')
      .subscribe(x => {
        this.thereWasPreviewImageBefore = x.length > 0;
      });
  }
  public mediaFilesAlreadyLoaded: Map<string, Observable<string>> =
    new Map<string, Observable<string>>();
  @Input()
  set receivedResource(resource: Resource) {
    console.log('Me llego resource', resource);
    console.log(JSON.parse(JSON.stringify(resource)));
    console.log(JSON.stringify(resource));
    this._resource = resource;
    if (!resource.properties) {
      console.log('creating game');
      this.setNewGame();
    } else {
      console.log('loading game');
      this.loadGame();
    }
  }

  private _resource: Resource;
  @HostBinding('style.background')
  public background: SafeStyle;

  constructor(private formBuilder: FormBuilder,
              private mediaService: MediaService,
              private sanitizer: DomSanitizer,
              public createService: LiftGameService,
              private cdr: ChangeDetectorRef) {
    this.currentChoice = 0;
  }


  ngOnInit(): void {
    timer(1000).subscribe( x => {
      const asd = {"ownerUid":"oQPbggIFzLcEHuDjp5ZNbkkVOlZ2","libraryItemType":"resource","customTextTranslations":{"es":{"previewData":{"path":""},"name":{"text":" game name "},"description":{"text":"game description"}}},"tagIds":{},"properties":{"format":"lift-game","miniLessonVersion":"with-custom-config-v2","customConfig":{"extraInfo":{"theme":"assets/boat-theme.jpg","exerciseCase":"created","gameUrl":"https://ml-creators.firebaseapp.com","randomOrder":true},"microLessonLevelConfigurations":[{"sublevelConfigurations":[{"exercises":[{"options":[{"showable":{"image":"","id":0,"video":"","audio":"","text":"Correcta"},"isCorrect":true,"id":0},{"showable":{"audio":"","text":"Incorrecta 1","video":"","id":0,"image":""},"isCorrect":false,"id":0},{"id":0,"isCorrect":false,"showable":{"id":0,"image":"","text":"Incorrecta 2","video":"","audio":""}}],"statement":{"image":"","id":0,"audio":"","video":"","text":"Un titulo"},"id":1},{"id":1,"statement":{"audio":"","text":"Imagen","id":0,"video":"","image":"1607600206040image-placeholder3.png"},"options":[{"isCorrect":false,"showable":{"image":"1607600219155record-audio-icon.png","text":"","video":"","audio":"","id":0},"id":0},{"showable":{"id":0,"video":"","text":"","image":"1607600222772lab-theme.jpg","audio":""},"id":0,"isCorrect":false},{"isCorrect":true,"id":0,"showable":{"text":"","video":"","image":"1607600233792image-placeholder3.png","id":0,"audio":""}}]}]}],"minScore":500,"maxScore":10000,"types":[{"value":2,"mode":"challenges"}],"exercisesToUpSubLevel":[2]}],"customMedia":["1607600206040image-placeholder3.png","1607600219155record-audio-icon.png","1607600222772lab-theme.jpg","1607600233792image-placeholder3.png"]},"miniLessonUid":"Lift game","url":"https://ml-screen-manager.firebaseapp.com"},"uid":"1Sf6zNAUJSsIX6s8iBqw","isPublic":false,"type":"mini-lesson","backupReferences":"","supportedLanguages":{"es":true,"en":false},"inheritedPedagogicalObjectives":[]};
      this.receivedResource = asd as Resource;
      console.log('Forcing send resource');
    });
    this.currentChoice = 0;
    this.background = this.sanitizer.bypassSecurityTrustStyle(
      '#e0d6c6 url("https://storage.googleapis.com/common-ox-assets/mini-lessons/answer-hunter/pattern-answer-hunters.png") repeat'
    );
  }

  private setNewGame(): void {
    this.createService.setNewGame(this._resource);
    this.formsReady();
  }

  private formsReady(): void {
    this.gameForm = this.formBuilder.group({
      basic: this.createService.infoFormGroup,
      exercises: this.createService.choicesFormArray,
      settings: this.createService.settingsFormGroup
    });
    this.cdr.detectChanges();
  }

  public addChoice(index?: number): void {
    this.createService.addChoice(index);
    this.cdr.detectChanges();
  }

  removeChoice(index: number): void {
    this.createService.removeChoice(index);
  }

  changeCurrentChoice(n: number): void {
    const temp = this.currentChoice + n;
    if (temp >= 0 && temp < this.createService.choicesFormArray.length) {
      this.currentChoice = temp;
    }
  }

  saveGameAndExit(): void {
    this.saveGame();
  }

  saveGame(): void {
    this.createService.setFormsBeforeSave(this._resource);
    const customConfigMediaAndFiles: {
      customConfig: any, filesToSave: { file: File, name: string }[], allMediaUtilized: string[]
    } = this.createService.getResourceCustomConfig(this._resource);
    (this._resource.properties as MicroLessonResourceProperties).customConfig =
      customConfigMediaAndFiles.customConfig;
    // const mediaDeleted = this.getMediaLoadedAndNotAssigned(allMediaUtilised)
    const mediaDeleted = this.getMediaLoadedAndNotAssigned(customConfigMediaAndFiles.allMediaUtilized)
      .filter(x => x !== 'preview-image');
    console.log(this.mediaFilesAlreadyLoaded);
    (this.mediaFilesAlreadyLoaded.get('preview-image') || of('')).subscribe(previewImageValue => {
      const objToSave = {
        resource: this._resource,
        value: {
          preview: {
            delete: (this.createService.infoFormGroup.get('image').value?.data !== undefined
              && previewImageValue.length > 0) ||
              (this.createService.infoFormGroup.get('image').value.length === 0 && this.thereWasPreviewImageBefore),
            file: this.createService.infoFormGroup.get('image').value?.data?.file || undefined
          },
          exercises: {toUpload: customConfigMediaAndFiles.filesToSave, delete: mediaDeleted}
        }
      };
      console.log(objToSave);
      this.save.emit(objToSave);
      mediaDeleted.forEach(mediaDed => {
        this.mediaFilesAlreadyLoaded.delete(mediaDed);
      });
    });
  }

  private getMediaLoadedAndNotAssigned(allMediaUtilised: string[]): string[] {
    return Array.from(this.mediaFilesAlreadyLoaded.keys())
      .filter(x => !allMediaUtilised.includes(x));
  }

  private loadGame(): void {
    this.createService.loadGame(this._resource);
    this.formsReady();
  }
}

