import {SortCreator} from './sort-creator';
import {AnagramGameTheme, SequenceGameExercise, SortSentencesGameTheme} from '../../../models/creators/sort-elements';
import {FormBuilder} from '@angular/forms';
import {MicroLessonFormatType} from 'ox-types';

export class SortSentencesCreator extends SortCreator<SortSentencesGameTheme> {

  readonly statementTextMaxLength = 85;
  readonly patternPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/pattern-sort-elements.png';
  readonly logoPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/sort-elements.svg';
  readonly backgroundColour = '#F2EFED';
  public optionWithImage = false;

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
    this.creatorType = 'sort-sentences';
    this.optionTextMaxLength = 100;
    this.themeInfo = [{
      text: 'Templo',
      theme: 'temple'
    }];

  }

  protected newExercise(): SequenceGameExercise {
    return {
      statement: {audio: '', image: '', text: 'Ordena las oraciones', video: '', id: 0},
      corrects: [
        {audio: '', image: '', text: 'Me desperté.', video: ''},
        {audio: '', image: '', text: 'Desayuné con mis padres.', video: ''},
        {audio: '', image: '', text: 'Después me lave los dientes.', video: ''},
        {audio: '', image: '', text: 'Ya preparado salí para la escuela.', video: ''},
      ],
      traps: [],
      id: 0
    };
  }

  getSrcImageByTheme(theme: SortSentencesGameTheme): string {
    const baseURl = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/themes/train/';
    switch (theme) {
      case 'temple':
        return baseURl + 'train-theme.jpg';
    }
  }

  protected getMinilessonUId(): string {
    return 'Ordenar oraciones';
  }

  protected getGameFormat(): MicroLessonFormatType {
    return 'sort-sentences';
  }

  protected getGameUrl(): string {
    return 'https://sort-elements.firebaseapp.com/';
  }
}
