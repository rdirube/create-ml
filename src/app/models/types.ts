export interface Showable {
  id?: number;
  video: string;
  text: string;
  image: string;
  audio: string;
}

export interface ShowableElement {
  id: number;
  showable: Showable;
}

export interface Option extends ShowableElement {
  isCorrect: boolean;
}
