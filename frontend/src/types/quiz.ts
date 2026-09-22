export interface QuizFormI {
  pass_mark: string;
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
    answer?: string;
    options: {
      id: number;
      option: string;
      correct?: boolean;
      correct_order?: number;
      match_option_id?: number;
    }[];
  }[];
}
