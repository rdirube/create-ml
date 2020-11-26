export interface MueroPorSaberGame {
  // ownerId?: number;
  /* id?: number;
  level?: number;
  name?: string;
  image?: string;
  tags?: Tag[];
  description?: string;
   */
  choices: ChoiceExercise [];
  // language?: string;
  settings: TriviaSettings;

  resourceUid?: string;

  // removedChoiceIds: number[];
  // orderExerciseIds: number[];
  // microLessonId: number;
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

export interface TriviaSettings {
  triviaType?: TriviaType;
  triviaProperties?: TriviaProperty[];

  type?: 'classic' | 'test'; // 'Clásico' | 'Examen'
  minPlayers?: number;
  maxPlayers?: number;
  host?: 'gauss' | 'cortazar' | 'yaci' | 'eulogia';
  goal?: number;
  randomOrder?: boolean;
}

export interface TriviaType {
  id: number;
  name: string;
  requiredPropertyTypes: TriviaPropertyType[];
}

export interface ChoiceExercise extends ShowableElement {
  id: number;
  elementsToShow: Showable[];
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
  elementsToShow: Showable[];
}

export interface Option extends ShowableElement {
  isCorrect: boolean;
}
