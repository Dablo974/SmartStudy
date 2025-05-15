
export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  subject?: string; // Optional: to categorize questions
  // New fields for spaced repetition
  dueDate: string; // ISO date string, when the question is next due
  intervalIndex: number; // Index in the repetition interval sequence (e.g., 0 for 1 day, 1 for 2 days, etc.)
  lastReviewedDate?: string; // ISO date string, when the question was last reviewed
}

export interface UserProgress {
  totalQuestionsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number; // percentage
  currentStreak: number; // days
  longestStreak: number; // days
  lastStudiedDate?: string; // ISO date string
  topicMastery?: { [topic: string]: number }; // percentage mastery per topic
}

export interface DailyQuestionSet {
  date: string; // ISO date string
  questions: MCQ[];
}
