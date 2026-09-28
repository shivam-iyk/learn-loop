import type { StateCreator } from "zustand";
import type { Option, QuizSliceI } from "../types/quiz";

export const createQuizSlice: StateCreator<QuizSliceI> = (set, get) => ({
  quiz: {
    id: 0,
    pass_mark: 0,
    questions: [
      {
        id: 1,
        type: "single_choice",
        question: "",
        answer: "",
        options: [
          {
            id: 11,
            option: "",
            correct: true,
          },
          {
            id: 12,
            option: "",
          },
        ],
      },
    ],
  },
  setQuiz: (quiz) => set({ quiz }),

  addQuestion: () => {
    const quiz = get().quiz;
    const lastQuestionId = quiz.questions.at(-1)?.id || 0;
    const lastOptionId = 0;
    set({
      quiz: {
        ...quiz,
        questions: [
          ...quiz.questions,
          {
            id: lastQuestionId + 1,
            type: "single_choice",
            question: "",
            options: [
              {
                id: lastOptionId + 1,
                option: "",
              },
              {
                id: lastOptionId + 2,
                option: "",
              },
            ],
          },
        ],
      },
    });
  },

  removeQuestion: (questionId) => {
    const quiz = get().quiz;
    set({
      quiz: {
        ...quiz,
        questions: quiz.questions.filter((q) => questionId !== q.id),
      },
    });
  },

  addOption: (questionId) => {
    const quiz = get().quiz;
    const type = quiz.questions.find((item) => item.id === questionId)?.type;

    const question = quiz.questions.find((item) => item.id === questionId);
    if (!question) return;

    const lastOptionId = parseInt(
      (question.options.at(-1)?.id || 0).toString(),
    );
    const options: Option[] = [];

    if (type === "match") {
      options.push(
        {
          id: lastOptionId + 1,
          option: "",
          correct: false,
          match_option_id: lastOptionId + 2,
        },
        {
          id: lastOptionId + 2,
          option: "",
          correct: false,
          match_option_id: lastOptionId + 1,
        },
      );
    } else {
      options.push({
        id: lastOptionId + 1,
        option: "",
        correct: false,
      });
    }

    set({
      quiz: {
        ...quiz,
        questions: quiz.questions.map((item) => {
          if (item.id === questionId) {
            console.log([...item.options, ...options]);
            return {
              ...item,
              options: [...item.options, ...options],
            };
          }
          return item;
        }),
      },
    });
  },

  removeOption: (questionId, optionId) => {
    const quiz = get().quiz;

    set({
      quiz: {
        ...quiz,
        questions: quiz.questions.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              options: q.options.filter((o) => o.id !== optionId),
            };
          }
          return q;
        }),
      },
    });
  },

  handleQuestionChange: (target, value, questionId) => {
    const quiz = get().quiz;
    let options: Option[] = [];
    const lastOptionId = parseInt(
      (quiz.questions.at(-1)?.id || 1).toString() + (0).toString(),
    );

    const types = ["single_choice", "multiple_choice"];
    const question = quiz.questions.find((item) => item.id === questionId);
    const prevType = question?.type;

    if (target === "type") {
      if (types.includes(prevType || "") && types.includes(value)) {
        console.log(question?.options);
        if (prevType === "single_choice" && value === "multiple_choice") {
          options.push(...(question?.options || []));
        } else {
          const source = question?.options || [];
          const firstCorrectIdx = source.findIndex((item) => item.correct);
          options = source.map((item, index) => {
            const correct =
              firstCorrectIdx === -1 ? index === 0 : firstCorrectIdx === index;
            return { ...item, correct };
          });
        }
      } else if (value === "true_false") {
        options.push(
          {
            id: lastOptionId + 1,
            option: "True",
            correct: true,
          },
          {
            id: lastOptionId + 2,
            option: "False",
          },
        );
      } else if (value === "match") {
        options.push(
          {
            id: lastOptionId + 1,
            option: "",
            match_option_id: lastOptionId + 2,
          },
          {
            id: lastOptionId + 2,
            option: "",
            match_option_id: lastOptionId + 1,
          },
          {
            id: lastOptionId + 3,
            option: "",
            match_option_id: lastOptionId + 4,
          },
          {
            id: lastOptionId + 4,
            option: "",
            match_option_id: lastOptionId + 3,
          },
        );
      } else {
        options.push(
          {
            id: lastOptionId + 1,
            option: "",
            correct: true,
          },
          {
            id: lastOptionId + 2,
            option: "",
          },
        );
      }
    }

    set((state) => ({
      quiz: {
        ...state.quiz,
        questions: quiz.questions.map((item) => {
          if (item.id === questionId) {
            return {
              ...item,
              [target]: value,
              options: target === "type" ? options : item.options,
            };
          }
          return item;
        }),
      },
    }));
  },

  handleOptionChange: (value, questionId, optionId) => {
    const quiz = get().quiz;

    set({
      quiz: {
        ...quiz,
        questions: quiz.questions.map((question) => {
          if (question.id === questionId) {
            return {
              ...question,
              options: question.options.map((option) => {
                if (option.id === optionId) {
                  return {
                    ...option,
                    option: value,
                  };
                }
                return option;
              }),
            };
          }
          return question;
        }),
      },
    });
  },

  handleCorrectChange: (value, questionId, optionId) => {
    const quiz = get().quiz;
    if (typeof value === "boolean" && !optionId) return;

    set({
      quiz: {
        ...quiz,
        questions: quiz.questions.map((question) => {
          if (question.id === questionId) {
            return {
              ...question,
              options: question.options.map((option) => {
                if (typeof value === "boolean") {
                  if (option.id === optionId) {
                    return {
                      ...option,
                      correct: value,
                    };
                  }
                  return option;
                }
                return {
                  ...option,
                  correct: value.includes(option.id.toString()),
                };
              }),
            };
          }
          return question;
        }),
      },
    });
  },

  handleReorder: (questionId, from, to) => {
    set(({ quiz }) => ({
      quiz: {
        ...quiz,
        questions: quiz.questions.map((q) => {
          if (q.id !== questionId) return q;

          const lefts: Option[] = [];
          const rights: Option[] = [];
          q.options.forEach((o, i) => (i % 2 === 0 ? lefts : rights).push(o));

          // move the right option from `from` to `to` (in place on the copy)
          const [moved] = rights.splice(from, 1);
          rights.splice(to, 0, moved);

          const options = lefts.flatMap((left, i) => {
            const right = rights[i];
            return [
              left.match_option_id === right.id
                ? left
                : { ...left, match_option_id: right.id },
              right.match_option_id === left.id
                ? right
                : { ...right, match_option_id: left.id },
            ];
          });

          return { ...q, options };
        }),
      },
    }));
  },
});
