import { Button, Modal } from "@heroui/react";
import { Maximize2 } from "lucide-react";
import { useState } from "react";
import RichTextField from "./RichTextField";
import { questionSchema } from "../schema/quiz";

function QuestionInput({
  question,
  setQuestion,
  onDelete,
  deleteVisible,
  placeholder = "Write something",
  label,
  invalid,
}: {
  question: string;
  invalid: boolean;
  label: string;
  deleteVisible: boolean;
  placeholder?: string;
  onDelete: () => void;
  setQuestion: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex-1">
        <RichTextField
          label={
            <div className="flex items-center justify-between">
              <div className="font-huninn uppercase text-muted tracking-tight text-xs">
                {label}
                <span className="text-danger"> *</span>
              </div>
              <Modal>
                <Modal.Trigger
                  className={`size-fit ${deleteVisible ? "" : "hidden"}`}
                >
                  <button
                    type="button"
                    className="text-xs text-danger hover:underline underline-offset-2 uppercase font-huninn"
                  >
                    Delete
                  </button>
                </Modal.Trigger>
                <Modal.Backdrop>
                  <Modal.Container>
                    <Modal.Dialog className="sm:max-w-[360px]">
                      <Modal.Header className="items-center text-center">
                        <Modal.Heading className="tracking-tight text-lg font-semibold">
                          Delete Question
                        </Modal.Heading>
                      </Modal.Header>
                      <Modal.Body>
                        <p>
                          Changes you made will be lost. Are you sure you want
                          to delete this question?
                        </p>
                      </Modal.Body>
                      <Modal.Footer className="flex-col">
                        <Button
                          variant="danger"
                          className="w-full"
                          slot="close"
                          onClick={onDelete}
                        >
                          Delete
                        </Button>
                        <Button
                          className="w-full"
                          slot="close"
                          variant="tertiary"
                        >
                          Cancel
                        </Button>
                      </Modal.Footer>
                    </Modal.Dialog>
                  </Modal.Container>
                </Modal.Backdrop>
              </Modal>
            </div>
          }
          placeholder={placeholder}
          toolbarClassName="hidden!"
          value={question}
          className="h-9! overflow-y-hidden!"
          onChange={(value) => setQuestion(value)}
          validate={(value) => {
            const result = questionSchema.safeParse(value);
            return result.success ? null : result.error.issues[0].message;
          }}
          invalid={invalid}
        />
      </div>
      <Modal isOpen={open} onOpenChange={setOpen}>
        <Button variant="ghost" size="sm" className="self-end mb-1" isIconOnly>
          <Maximize2 />
        </Button>
        <Modal.Backdrop>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.Body className="text-foreground">
                <RichTextField
                  label={
                    <div className="flex items-center justify-between">
                      <div className="font-huninn uppercase text-muted tracking-tight text-xs">
                        {label}
                        <span className="text-danger"> *</span>
                      </div>
                    </div>
                  }
                  toolbarClassName="[&>div]:overflow-x-auto [&>div]:flex-nowrap flex-nowrap!"
                  placeholder={placeholder}
                  className="overflow-y-auto max-h-[60vh]"
                  value={question}
                  onChange={(value) => setQuestion(value)}
                  validate={(value) => {
                    const result = questionSchema.safeParse(value);
                    return result.success
                      ? null
                      : result.error.issues[0].message;
                  }}
                  invalid={invalid}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button slot="close" className="w-full">
                  Done
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}

export default QuestionInput;
