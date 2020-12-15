import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  public audioFileLoaded = new EventEmitter<{ name: string, value: string }>();

  constructor() { }
}
