
export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  subject?: string; // Optional: to categorize questions
  // New fields for spaced repetition
  nextReviewSession: number; // Session number when the question is next due
  intervalIndex: number; // Index in the repetition interval sequence
  lastReviewedSession?: number; // Session number when the question was last reviewed
  // New fields for tracking performance
  timesCorrect: number;
  timesIncorrect: number;
}

export interface McqSet {
  id: string; // Unique ID for the set (e.g., timestamp_filename or UUID)
  fileName: string;
  uploadDate: string; // ISO Date string
  mcqs: MCQ[];
  isActive: boolean; // User can toggle this
}

export interface UserProgress {
  totalQuestionsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number; // percentage
  topicMastery?: { [topic: string]: number }; // percentage mastery per topic
}

export interface DailyQuestionSet {
  date: string; // ISO date string
  questions: MCQ[];
}
