import {SortCreator} from './sort-creator';
import {AnagramGameTheme, SequenceGameExercise} from '../../../models/creators/sort-elements';
import {FormBuilder} from '@angular/forms';
import {MicroLessonFormatType} from 'ox-types';

export class AnagramCreator extends SortCreator<AnagramGameTheme> {

  readonly statementTextMaxLength = 85;
  readonly patternPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/pattern-sort-elements.png';
  readonly logoPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/sort-elements.svg';
  readonly backgroundColour = '#F2EFED';
  public optionWithImage = false;
  public optionWithAudio = false;

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
    this.creatorType = 'anagram';
    this.optionTextMaxLength = 5;
    this.themeInfo = [{
      text: 'Tren',
      theme: 'train'
    }];

  }

  protected newExercise(): SequenceGameExercise {
    return {
      statement: {audio: '', image: '', text: 'Palabra que usamos para saludar', video: '', id: 0},
      corrects: [
        {audio: '', image: '', text: 'h', video: ''},
        {audio: '', image: '', text: 'o', video: ''},
        {audio: '', image: '', text: 'l', video: ''},
        {audio: '', image: '', text: 'a', video: ''},
      ],
      traps: [],
      id: 0
    };
  }

  getSrcImageByTheme(theme: AnagramGameTheme): string {
    const baseURl = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/themes/train/';
    switch (theme) {
      case 'train':
        return baseURl + 'train-theme.jpg';
    }
  }

  protected getMinilessonUId(): string {
    return 'Anagrama';
  }

  protected getGameFormat(): MicroLessonFormatType {
    return 'anagram';
  }

  protected getGameUrl(): string {
    return 'https://sort-elements.firebaseapp.com/';
  }
}
