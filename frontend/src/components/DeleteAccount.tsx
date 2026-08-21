import {
  Button,
  Description,
  Form,
  Input,
  Label,
  Modal,
  TextArea,
  TextField,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { issueSchema, problemSchema } from "../schema/feedback";
import { useState } from "react";

function DeleteAccount() {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState({
    issue: "",
    problem: "",
  });

  const handleDelete = () => {
    navigate("/login");
  };

  return (
    <div
      className="flex flex-col gap-4 bg-danger-soft border border-danger-soft-hover p-6 rounded-xl scroll-mt-20"
      id="delete-account"
    >
      <h5 className="md:text-2xl text-xl font-outfit font-semibold tracking-tight text-danger">
        Delete Account
      </h5>
      <div>
        <p className="max-sm:text-sm text-danger-soft-foreground">
          We&apos;re sorry to see you go—if you have feedback, we&apos;d love to
          hear it.
        </p>
        <p className="max-sm:text-sm text-danger-soft-foreground mt-1">
          Your account will be permanently deleted after 72 hours, but you can
          cancel anytime by simply logging back in. After that period, deletion
          is final and cannot be undone.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="danger" onClick={handleDelete}>
          Delete Account
        </Button>
        <Modal>
          <Button variant="danger-soft">Leave Feedback</Button>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <h4 className="text-xl text-center font-outfit tracking-tight font-semibold">
                    Feedback
                  </h4>
                </Modal.Header>
                <Modal.Body>
                  <Form className="flex flex-col gap-4">
                    <TextField
                      name="issue"
                      value={feedback.issue}
                      onChange={(value) =>
                        setFeedback((prev) => ({ ...prev, issue: value }))
                      }
                      validate={(value) => {
                        const result = issueSchema.safeParse(value);
                        return result.success
                          ? null
                          : result.error.issues[0].message;
                      }}
                    >
                      <Label>
                        Issue <span className="text-danger text-sm">*</span>
                      </Label>
                      <Input placeholder="What issue you're facing" />
                    </TextField>
                    <TextField
                      name="problem"
                      value={feedback.problem}
                      onChange={(value) =>
                        setFeedback((prev) => ({ ...prev, problem: value }))
                      }
                      validate={(value) => {
                        const result = problemSchema.safeParse(value);
                        return result.success
                          ? null
                          : result.error.issues[0].message;
                      }}
                    >
                      <Label>
                        Problem <span className="text-danger text-sm">*</span>
                      </Label>
                      <TextArea placeholder="Tell us more more about the issue" className="max-h-[50vh]" />
                      <Description>
                        We&apos;ll try our best to resolve this issue as soon as
                        possible
                      </Description>
                    </TextField>
                    <Button className="w-full">Submit</Button>
                  </Form>
                </Modal.Body>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
    </div>
  );
}

export default DeleteAccount;
