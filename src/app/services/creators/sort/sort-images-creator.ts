import {SortCreator} from './sort-creator';
import {SequenceGameExercise, SortElementsGameTheme} from '../../../models/creators/sort-elements';
import {FormBuilder} from '@angular/forms';
import {MicroLessonFormatType} from 'ox-types';

export class SortImagesCreator extends SortCreator<SortElementsGameTheme> {

  readonly statementTextMaxLength = 85;
  readonly patternPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/pattern-sort-elements.png';
  readonly logoPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/sort-elements.svg';
  readonly backgroundColour = '#F2EFED';

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
    this.creatorType = 'sort-elements';
    this.optionTextMaxLength = 12;
    this.themeInfo = [{
      text: 'Templo',
      theme: 'temple'
    }];
  }

  protected newExercise(): SequenceGameExercise {
    return {
      statement: {audio: '', image: '', text: 'Ordena la secuencia de imágenes', video: '', id: 0},
      corrects: [
        {audio: '', image: '', text: '', video: ''},
        {audio: '', image: '', text: '', video: ''},
      ],
      traps: [],
      id: 0
    };
  }

  getSrcImageByTheme(theme: SortElementsGameTheme): string {
    const baseURl = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/themes/train/';
    switch (theme) {
      case 'temple':
        return baseURl + 'train-theme.jpg';
    }
  }

  protected getMinilessonUId(): string {
    return 'Ordenar imágenes';
  }

  protected getGameFormat(): MicroLessonFormatType {
    return 'sort-elements';
  }

  protected getGameUrl(): string {
    return 'https://sort-elements.firebaseapp.com/';
  }
}
