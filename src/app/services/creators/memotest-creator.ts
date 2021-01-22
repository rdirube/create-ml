import {RelationsCreator} from './relations-creator';
import {MemotestGameTheme} from '../../models/creators/memotest';
import {MicroLessonFormatType} from 'ox-types';

export class MemotestCreator extends RelationsCreator<MemotestGameTheme> {

  readonly statementTextMaxLength = 85;
  readonly patternPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/pattern-sort-elements.png';
  readonly logoPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/memotest/memotest.svg';
  readonly backgroundColour = '#F2EFED';

  constructor(props) {
    super(props);
    this.canAddExercises = false;
    this.creatorType = 'join-with-arrows';
    this.themeInfo = [{
      text: 'Vólcan',
      theme: 'vulcano'
    }];
  }

  getSrcImageByTheme(theme: MemotestGameTheme): string {
    const baseURl = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/themes/train/';
    switch (theme) {
      case 'vulcano':
        return baseURl + 'train-theme.jpg';
    }
  }

  protected getGameURl(): string {
    return 'https://memotest-ox.firebaseapp.com/';
  }

  protected getFormat(): MicroLessonFormatType {
    return 'memotest';
  }

  protected getMiniLessonUid(): string {
    return 'Memotest';
  }
}

