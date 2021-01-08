import {RelationsCreator} from './relations-creator';
import {JoinWithArrowsGameTheme} from '../../models/creators/memotest';
import {MicroLessonFormatType} from 'ox-types';

export class JoinWithArrowsCreator extends RelationsCreator<JoinWithArrowsGameTheme> {
  readonly statementTextMaxLength = 85;
  readonly patternPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/sort-elements/pattern-sort-elements.png';
  readonly logoPath = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/join-with-arrows/join-with-arrows.svg';
  readonly backgroundColour = '#F2EFED';

  constructor(props) {
    super(props);
    this.creatorType = 'join-with-arrows';
    this.themeInfo = [{
      text: 'ocean',
      theme: 'ocean'
    }];
  }

  getSrcImageByTheme(theme: JoinWithArrowsGameTheme): string {
    const baseURl = 'https://storage.googleapis.com/common-ox-assets/mini-lessons/join-with-arrows/themes/';
    switch (theme) {
      case 'ocean':
        return baseURl + 'vulcano-theme.jpg';
    }
  }

  protected getGameURl(): string {
    return 'https://join-with-arrows.firebaseapp.com/';
  }


  protected getFormat(): MicroLessonFormatType {
    return 'join-with-arrows';
  }

  protected getMiniLessonUid(): string {
    return 'Join with arrows';
  }

}

