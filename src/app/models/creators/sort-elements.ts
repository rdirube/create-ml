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
  theme: 'circus' | 'boat' | 'lab';
  exerciseCount: number;
  randomOrder?: boolean;
}
