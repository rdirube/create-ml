import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-game-info-form',
  templateUrl: './game-info-form.component.html',
  styleUrls: ['./game-info-form.component.scss']
})
export class GameInfoFormComponent implements OnInit {

  @Input() mediaFilesAlreadyLoaded: Map<string, Observable<string>>;
  @Input() form: FormGroup;
  @Input() resourceUid: string;
  public $image: string;
  languages = ['ESP', 'ENG', 'FRE', 'GER', 'ITA', 'POR'];

  // private customAddedTags: {id: string, name: string}[];
  /* public tags: {id: number, name: string}[]; */
  constructor() { }
              // private multimediaService: MultimediaService) { }

  ngOnInit(): void {
    /*   this.form.get('description').valueChanges.subscribe(value => {
        this.detectDescriptionTags();
      }); */
    this.$image = 'library/items/' +  this.resourceUid + '/preview-image-es';
    /* const name = this.form.get('image').value;
    if (name && typeof name === 'string') {
      this.$image = name ? 'library/items/' +  this.resourceUid + '/preview-image-es' : undefined;
    } */
    /* this.form.get('tags').valueChanges.subscribe(value => {
    }); */
    /* this.customAddedTags = []; */
  }

  uploadFile($event: any): void {
  // uploadFile($event: UploadOutput): void {
    if ($event.type !== 'done' && $event.type !== 'addedToQueue') {
      return;
    }
    const nativeFile = $event.nativeFile || $event.file.nativeFile;
    if (nativeFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.$image = undefined;
        this.form.get('image').setValue({name: nativeFile.name, data: {file: nativeFile, base64: reader.result}});
      };
      reader.readAsDataURL(nativeFile);
    }
  }
}
