import {Option, Showable} from '../types';

export interface LiftGame {
  choices: LiftGameExercise [];
  // choices: ChoiceExercise [];
  settings: LiftGameSettings;
  resourceUid?: string;
}

export interface LiftGameExercise {
  id: number;
  statement: Showable;
  options: Option[];
}

export interface LiftGameSettings {
  // triviaType?: TriviaType;
  // triviaProperties?: TriviaProperty[];
  type?: 'classic' | 'test'; // 'Clásico' | 'Examen'
  theme: 'circus' | 'boat' | 'lab';
  exerciseCount: number;
  randomOrder?: boolean;
}
