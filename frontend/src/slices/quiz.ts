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
    } else if (type === "order") {
      const lastCorrectOrder = question.options.at(-1)?.correct_order || 0;
      options.push({
        id: lastOptionId + 1,
        option: "",
        correct_order: lastCorrectOrder + 1,
      });
    } else {
      options.push({
        id: lastOptionId + 1,
        option: "",
      });
    }

    set({
      quiz: {
        ...quiz,
        questions: quiz.questions.map((item) => {
          if (item.id === questionId) {
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
    const lastOptionId = parseInt(String(questionId) + String(0));

    const types = ["single_choice", "multiple_choice"];
    const question = quiz.questions.find((item) => item.id === questionId);
    const prevType = question?.type;

    if (target === "type") {
      if (types.includes(prevType || "") && types.includes(value)) {
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
      } else if (value === "fill") {
        options = [];
      } else if (value === "order") {
        options.push(
          {
            id: lastOptionId + 1,
            option: "",
            correct_order: 1,
          },
          {
            id: lastOptionId + 2,
            option: "",
            correct_order: 2,
          },
        );
      } else {
        const correct = value === "order" ? undefined : true;
        options.push(
          {
            id: lastOptionId + 1,
            option: "",
            correct,
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
        questions: quiz.questions.map((question) => {
          if (question.id === questionId) {
            return {
              ...question,
              [target]: value,
              options: target === "type" ? options : question.options,
            };
          }
          return question;
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
    if (from === to) return;
    set(({ quiz }) => ({
      quiz: {
        ...quiz,
        questions: quiz.questions.map((question) => {
          if (question.id !== questionId) return question;

          const options = [...question.options];
          const [moved] = options.splice(from, 1);
          options.splice(to, 0, moved);

          if (question.type !== "order") {
            return { ...question, options };
          }

          const synced = options.map((option, index) =>
            option.correct_order === index + 1
              ? option
              : { ...option, correct_order: index + 1 },
          );

          return { ...question, options: synced };
        }),
      },
    }));
  },

  handleMatchReorder: (questionId, from, to) => {
    if (from === to) return;

    set(({ quiz }) => ({
      quiz: {
        ...quiz,
        questions: quiz.questions.map((question) => {
          if (question.id !== questionId) return question;

          // `from`/`to` are positions within the right column only
          // (left column is fixed, never draggable)
          const lefts = question.options.filter((_, i) => i % 2 === 0);
          const rights = question.options.filter((_, i) => i % 2 === 1);

          const movedItem = rights[from];
          const withoutMoved = rights.filter((_, i) => i !== from);
          const reordered = [
            ...withoutMoved.slice(0, to),
            movedItem,
            ...withoutMoved.slice(to),
          ];

          const options = lefts.flatMap((left, i) => {
            const right = reordered[i];
            return [
              { ...left, match_option_id: right.id },
              { ...right, match_option_id: left.id },
            ];
          });

          return { ...question, options };
        }),
      },
    }));
  },
});
