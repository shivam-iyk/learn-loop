export interface Question {
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
  options: Option[];
}

export interface Option {
  id: number;
  option: string;
  correct?: boolean;
  correct_order?: number;
  match_option_id?: number;
}

export interface QuizI {
  id: number;
  pass_mark: number;
  instructions?: string;
  questions: Question[];
}

export interface QuizSliceI {
  quiz: QuizI;
  setQuiz: (quiz: QuizSliceI["quiz"]) => void;
  addQuestion: () => void;
  removeQuestion: (questionId: number) => void;
  addOption: (questionId: number) => void;
  removeOption: (questionId: number, optionId: number) => void;
  handleQuestionChange: (
    target: string,
    value: string,
    questionId: number,
  ) => void;
  handleOptionChange: (
    value: string,
    questionId: number,
    optionId: number,
  ) => void;
  handleCorrectChange: (
    value: boolean | string[],
    questionId: number,
    optionId?: number,
  ) => void;
  handleReorder: (questionId: number, from: number, to: number) => void;
  handleMatchReorder: QuizSliceI["handleReorder"];
}
