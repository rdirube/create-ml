import {Game} from './lift-game-creator';
import {Showable} from '../types';

export interface RelationsGame<GameTheme> extends Game<RelationGameExercise, RelationsGameSettings<GameTheme>>{
}


export interface RelationGameExercise {
  id: number;
  statement: Showable;
  relations: Relation[];
  traps: Showable[];
}

export interface RelationsGameSettings<GameTheme> {
  type?: 'classic' | 'test'; // 'Clásico' | 'Examen'
  theme: GameTheme;
  exerciseCount: number;
  randomOrder?: boolean;
}
export type JoinWithArrowsGameTheme = 'ocean';
export type MemotestGameTheme = 'vulcano';


export interface Relation {
  relation: [Showable, Showable];
}
