
export type QuestionType = 'short' | 'essay';

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  answerHTML: string;
  tags: string[];
  bookmarked: boolean;
  updatedAt: number;
}

export interface Chapter {
  id: string;
  name: string;
  questions: Question[];
}

export interface AppState {
  chapters: Chapter[];
  darkMode: boolean;
}
