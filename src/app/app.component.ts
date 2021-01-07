import {ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, of, timer} from 'rxjs';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {MicroLessonResourceProperties, Resource, ResourceProperties} from 'ox-types';
import {MediaService} from './services/media.service';
import {Creator} from './services/creators/creator';
import {SortElementsCreator} from './services/creators/sort-elements-creator';
import {LiftCreator} from './services/creators/lift-creator';
import {RelationsCreator} from './services/creators/relations-creator';
import {JoinWithArrowsCreator} from './services/creators/join-with-arrows-creator';
import {MemotestCreator} from './services/creators/memotest-creator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'create-ml';
  private textsLanguage = 'es';

  public creator: Creator<any, any, any>;

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
    if (this.mediaFilesAlreadyLoaded.get('preview-image')) {
      this.mediaFilesAlreadyLoaded.get('preview-image')
        .subscribe(x => {
          this.thereWasPreviewImageBefore = x.length > 0;
        });
    }
  }

  public mediaFilesAlreadyLoaded: Map<string, Observable<string>> =
    new Map<string, Observable<string>>();

  @Input()
  set receivedResource(resource: Resource) {
    console.log('Me llego resource', resource);
    console.log(JSON.parse(JSON.stringify(resource)));
    console.log(JSON.stringify(resource));
    this._resource = resource;
    this.creator = this.instanciateCreatorByResource(resource);
    if (!(resource.properties as MicroLessonResourceProperties).url) {
      console.log('creating game');
      this.setNewGame();
    } else {
      console.log('loading game');
      this.loadGame();
    }
    console.log(this.creator.backgroundColour);
    this.background = this.sanitizer.bypassSecurityTrustStyle(
      this.creator.backgroundColour + ' url("' + this.creator.patternPath + '") repeat'
    );
  }

  private _resource: Resource;
  @HostBinding('style.background')
  public background: SafeStyle;

  constructor(private formBuilder: FormBuilder,
              private mediaService: MediaService,
              private sanitizer: DomSanitizer,
              // public creator: LiftGameService,
              private cdr: ChangeDetectorRef) {
    this.currentChoice = 0;
  }

  ngOnInit(): void {
    // timer(1000).subscribe(x => {
    //   const asd = {
    //       'supportedLanguages': {'es': true, 'en': false},
    //       'isPublic': false,
    //       'ownerUid': 'oQPbggIFzLcEHuDjp5ZNbkkVOlZ2',
    //       'uid': 'dUKr5JJrsVDOD47oscop',
    //       'inheritedPedagogicalObjectives': [],
    //       'properties': {'format': 'memotest'},
    //       'customTextTranslations': {},
    //       'backupReferences': '',
    //       'type': 'mini-lesson',
    //       'libraryItemType': 'resource',
    //       'tagIds': {}
    //     }
    //   ;
    //   // const asd = undefined;
    //   this.receivedResource = asd as any as Resource;
    // });
    this.currentChoice = 0;

  }

  private setNewGame(): void {
    this.creator.setNewGame(this._resource);
    this.formsReady();
    console.log(this.creator.choicesFormArray);
  }

  private formsReady(): void {
    this.gameForm = this.formBuilder.group({
      basic: this.creator.infoFormGroup,
      exercises: this.creator.choicesFormArray,
      settings: this.creator.settingsFormGroup
    });
    this.cdr.detectChanges();
  }

  public addChoice(index?: number): void {
    this.creator.addChoice(index);
    this.cdr.detectChanges();
  }

  removeChoice(index: number): void {
    this.creator.removeChoice(index);
  }

  changeCurrentChoice(n: number): void {
    const temp = this.currentChoice + n;
    if (temp >= 0 && temp < this.creator.choicesFormArray.length) {
      this.currentChoice = temp;
    }
  }

  saveGameAndExit(): void {
    this.saveGame();
  }

  saveGame(): void {
    this.creator.setFormsBeforeSave(this._resource);
    const customConfigMediaAndFiles: {
      customConfig: any, filesToSave: { file: File, name: string }[], allMediaUtilized: string[]
    } = this.creator.getResourceCustomConfig(this._resource);
    (this._resource.properties as MicroLessonResourceProperties).customConfig =
      customConfigMediaAndFiles.customConfig;
    // const mediaDeleted = this.getMediaLoadedAndNotAssigned(allMediaUtilised)
    const mediaDeleted = this.getMediaLoadedAndNotAssigned(customConfigMediaAndFiles.allMediaUtilized)
      .filter(x => x !== 'preview-image');
    // console.log(this.mediaFilesAlreadyLoaded);
    (this.mediaFilesAlreadyLoaded.get('preview-image') || of('')).subscribe(previewImageValue => {
      const objToSave = {
        resource: this._resource,
        value: {
          preview: {
            delete: (this.creator.infoFormGroup.get('image').value?.data !== undefined
              && previewImageValue.length > 0) ||
              (this.creator.infoFormGroup.get('image').value.length === 0 && this.thereWasPreviewImageBefore),
            file: this.creator.infoFormGroup.get('image').value?.data?.file || undefined
          },
          exercises: {toUpload: customConfigMediaAndFiles.filesToSave, delete: mediaDeleted}
        }
      };
      console.log(objToSave);
      this.save.emit(objToSave);
      mediaDeleted.forEach(mediaDed => {
        this.mediaFilesAlreadyLoaded.delete(mediaDed);
      });
      console.log(JSON.stringify(objToSave.resource));
    });
  }

  private getMediaLoadedAndNotAssigned(allMediaUtilised: string[]): string[] {
    return Array.from(this.mediaFilesAlreadyLoaded.keys())
      .filter(x => !allMediaUtilised.includes(x));
  }

  private loadGame(): void {
    this.creator.loadGame(this._resource);
    this.formsReady();
  }

  private instanciateCreatorByResource(resource: Resource): Creator<any, any, any> {
    console.log('resource properties...', JSON.stringify(resource.properties));
    if (!resource.properties) {
      resource.properties = {
        format: 'memotest'
      } as MicroLessonResourceProperties;
    } //  TODO change that any and add memotest to ox types
    switch ((resource.properties as MicroLessonResourceProperties).format) {
      case 'answer-hunter':
        return new LiftCreator(this.formBuilder);
      case 'sort-elements':
        return new SortElementsCreator(this.formBuilder);
      case 'memotest':
        return new MemotestCreator(this.formBuilder);
      case 'join-with-arrows':
        return new JoinWithArrowsCreator(this.formBuilder);
    }
  }
}

