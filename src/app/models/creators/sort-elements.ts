import {Showable} from '../types';
import {Game} from './lift-game-creator';

export interface SequenceGame extends  Game <SequenceGameExercise, SequenceGameSettings>{
}


export interface SequenceGameExercise {
  id: number;
  statement: Showable;
  corrects: Showable[];
  traps: Showable[];
}

export interface SequenceGameSettings {
  type?: 'classic' | 'test'; // 'Clásico' | 'Examen'
  theme: SequenceGameTheme;
  exerciseCount: number;
  randomOrder?: boolean;
}
export type AnagramGameTheme = 'train';
export type SortNumbersGameTheme = 'train';
export type SortElementsGameTheme = 'temple';
export type SortSentencesGameTheme = 'temple';
export type SequenceGameTheme = 'train' | 'temple';
