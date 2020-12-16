import {Option, Showable} from '../types';

export interface Game<E, S> {
  exercises: E [];
  // exercises: ChoiceExercise [];
  settings: S;
  resourceUid?: string;
}

export interface LiftGame extends Game<LiftGameExercise, LiftGameSettings>{
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
