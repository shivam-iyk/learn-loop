import { Button, Modal } from "@heroui/react";
import { CircleQuestionMark } from "lucide-react";

function QuizGuidelines() {
  return (
    <Modal>
      <Button variant="ghost" size="sm" isIconOnly>
        <CircleQuestionMark />
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="font-outfit font-semibold tracking-tight text-center text-lg">Quiz Creation Guidelines</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <ul
                className="list-decimal pl-4"
              >
                <li>Add a clear and concise question for each quiz item.</li>
                <li>Every question must have at least two options.</li>
                <li>
                  Select the checkbox beside an option to mark it as correct.
                  You can mark one or more correct answers if applicable.
                </li>
                <li>Use Add Option to include additional answer choices.</li>
                <li>Use Add Question to create more quiz questions.</li>
                <li>
                  Drag the handle beside an option to reorder the options.
                </li>
                <li>
                  Set the Passing Marks. It cannot exceed the total number of
                  questions.
                </li>
                <li>
                  Provide quiz Instructions to help learners understand how to
                  attempt the quiz.
                </li>
                <li>
                  Review all questions and answers before saving, as incorrect
                  answers may affect learners' results.
                </li>
              </ul>
            </Modal.Body>
            <Modal.Footer />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default QuizGuidelines;
