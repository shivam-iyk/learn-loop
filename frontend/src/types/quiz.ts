export interface QuizFormI {
  passMark: string;
  instructions: string;
  questions: {
    id: number;
    type:
      | "single_choice"
      | "multiple_choice"
      | "true_false"
      | "match"
      | "fill"
      | "order";
    question: string;
    options: {
      id: number;
      option: string;
      correct: boolean;
    }[];
  }[];
}