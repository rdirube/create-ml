import {SortCreator} from './sort-creator';
import {AnagramGameTheme, SequenceGameExercise, SortNumbersGameTheme} from '../../../models/creators/sort-elements';
import {FormBuilder} from '@angular/forms';
import {MicroLessonFormatType} from 'ox-types';

export class SortNumbersCreator extends SortCreator<SortNumbersGameTheme> {

  readonly statementTextMaxLength = 85;
  readonly patternPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/pattern-sort-elements.png';
  readonly logoPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/sort-elements.svg';
  readonly backgroundColour = '#F2EFED';
  public optionWithImage = false;
  public optionWithAudio = false;

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
    this.creatorType = 'sort-numbers';
    this.optionTextMaxLength = 5;
    this.themeInfo = [{
      text: 'Tren',
      theme: 'train'
    }];

  }

  protected newExercise(): SequenceGameExercise {
    return {
      statement: {audio: '', image: '', text: 'Ordena los numeros de menor a mayor', video: '', id: 0},
      corrects: [
        {audio: '', image: '', text: '1', video: ''},
        {audio: '', image: '', text: '2', video: ''},
        {audio: '', image: '', text: '3', video: ''},
      ],
      traps: [],
      id: 0
    };
  }

  getSrcImageByTheme(theme: SortNumbersGameTheme): string {
    const baseURl = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/themes/train/';
    switch (theme) {
      case 'train':
        return baseURl + 'train-theme.jpg';
    }
  }

  protected getMinilessonUId(): string {
    return 'Secuencias númericas';
  }

  protected getGameFormat(): MicroLessonFormatType {
    return 'sort-numbers';
  }

  protected getGameUrl(): string {
    return 'https://sort-elements.firebaseapp.com/';
  }
}
