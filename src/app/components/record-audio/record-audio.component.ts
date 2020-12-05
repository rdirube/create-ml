import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {UploadOutput} from 'ngx-uploader';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-record-audio',
  templateUrl: './record-audio.component.html',
  styleUrls: ['./record-audio.component.scss']
})
export class RecordAudioComponent implements AfterViewInit {
  @ViewChild('audio', {static: false}) audio: ElementRef;
  @Output()
  public endAudio: EventEmitter<UploadOutput>;
  public isRecording: boolean;
  public currentTime: number;
  public maxSeconds: number;
  public timeSubscription: Subscription;

  private stream: MediaStream;
  private recordRTC: any;

  constructor(private cdr: ChangeDetectorRef) {
    this.endAudio = new EventEmitter<UploadOutput>();
    this.maxSeconds = 90;
  }

  ngAfterViewInit(): void {
    // set the initial state of the video
    const audio: HTMLVideoElement = this.audio.nativeElement;
    audio.muted = false;
    audio.controls = true;
    audio.autoplay = false;
  }

  startRecording(): void {
    this.timeSubscription = timer(0, 1000).subscribe(value => {
      this.currentTime = value;
      this.cdr.detectChanges();
    });
    this.isRecording = true;
    const mediaConstraints: any = {
      audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  errorCallback(): void {
    // todo
    console.log('error!');
    this.isRecording = false;
    this.timeSubscription.unsubscribe();
    // handle error here
  }

  successCallback(stream: MediaStream): void {
    const options = {
      type: 'audio'
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.setRecordingDuration(this.maxSeconds * 1000).onRecordingStopped(this.processVideo.bind(this));
    this.recordRTC.startRecording();
    /*const video: HTMLAudioElement = this.audio.nativeElement;
    video.src = window.URL.createObjectURL(stream);*/
    this.toggleControls();
  }

  toggleControls(): void {
    const video: HTMLAudioElement = this.audio.nativeElement;
    video.muted = !video.muted;
    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }

  stopRecording(): void {
    const recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    const stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    /*
        stream.getVideoTracks().forEach(track => track.stop());
    */
  }

  processVideo(audioVideoWebMURL): void {
    const video: HTMLAudioElement = this.audio.nativeElement;
    const recordRTC = this.recordRTC;
    video.src = audioVideoWebMURL;
    this.toggleControls();
    const recordedBlob = recordRTC.getBlob();
    const nativeFile = this.blobToFile(recordedBlob, 'audio_' + +(new Date()) + '.mp3');
    this.endAudio.next({type: 'done', nativeFile});
    this.isRecording = false;
    this.timeSubscription.unsubscribe();
    this.recordRTC.clearRecordedData();
    /* recordRTC.getDataURL(function (dataURL) {
       console.log('audip? data url');
       console.log(dataURL);
     });*/
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    // Cast to a File() type
    return new File([theBlob], fileName, {type: 'audio/mp3'});
  }
}
