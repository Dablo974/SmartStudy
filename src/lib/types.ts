export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  subject?: string; // Optional: to categorize questions
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
