import {Game} from './lift-game-creator';
import {Showable} from '../types';

export interface MemotestGame extends Game<MemotestGameExercise, MemotestGameSettings>{
}


export interface MemotestGameExercise {
  id: number;
  statement: Showable;
  relations: Relation[];
  traps: Showable[];
}

export interface MemotestGameSettings {
  type?: 'classic' | 'test'; // 'Clásico' | 'Examen'
  theme: MemotestGameTheme;
  exerciseCount: number;
  randomOrder?: boolean;
}
export type MemotestGameTheme = 'monster';


export interface Relation {
  relation: [Showable, Showable];
}
