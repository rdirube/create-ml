export interface LiftGame {
  choices: LiftGameExercise [];
  // choices: ChoiceExercise [];
  settings: LiftGameSettings;
  resourceUid?: string;
}

export interface TriviaPropertyType {
  id: number;
  name: string;
}

export interface TriviaProperty {
  id: number;
  triviaPropertyType: TriviaPropertyType;
  value: string;
}

export interface LiftGameSettings {
  // triviaType?: TriviaType;
  // triviaProperties?: TriviaProperty[];
  type?: 'classic' | 'test'; // 'Clásico' | 'Examen'
  theme: 'circus' | 'boat' | 'lab';
  exerciseCount: number;
  randomOrder?: boolean;
}

export interface TriviaType {
  id: number;
  name: string;
  requiredPropertyTypes: TriviaPropertyType[];
}

export interface LiftGameExercise {
  id: number;
  statement: Showable;
  options: Option[];
}

export interface ChoiceExercise extends ShowableElement {
  id: number;
  showable: Showable;
  options: Option[];
}

export interface Showable {
  id?: number;
  video: string;
  text: string;
  image: string;
  audio: string;
  // showableType: ShowableProperty[];
}

export interface ShowableElement {
  id: number;
  showable: Showable;
}

export interface Option extends ShowableElement {
  isCorrect: boolean;
}
