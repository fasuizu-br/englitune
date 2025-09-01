export interface Entry {
  transcript: string;
  sequence: string;
  speaker: string;
  age: number;
  gender: string;
  accent: string;
  region?: string;
}

export interface Study {
  step: number;
  review: Date;
  incorrect: number;
  entry: Entry;
}

export interface GroupedSequences {
  [speaker: string]: string[];
}
