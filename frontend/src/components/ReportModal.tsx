import {
  Select,
  Button,
  Modal,
  ListBox,
  TextField,
  TextArea,
  Form,
} from "@heroui/react";
import { ShieldAlert } from "lucide-react";
import { useState, type FormEvent } from "react";
import { problemSchema } from "../schema/report";

function ReportModal({
  heading,
  issues,
  placeholder = "Describe your issue",
}: {
  heading: string;
  issues: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState({
    issue: "",
    problem: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(report);
  };

  return (
    <Modal isOpen={open} onOpenChange={(value) => setOpen(value)}>
      <Button variant="danger-soft">
        <ShieldAlert /> Report
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <h4 className="text-xl font-outfit tracking-tight font-semibold">
                {heading}
              </h4>
            </Modal.Header>
            <Modal.Body>
              <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Select
                  value={report.issue}
                  onChange={(value) =>
                    setReport((prev) => ({
                      ...prev,
                      issue: value?.toString() || "",
                    }))
                  }
                  placeholder="Select issue"
                >
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {issues.map((item, index) => (
                        <ListBox.Item textValue={item} id={item} key={index}>
                          {item}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
                <TextField
                  value={report.problem}
                  onChange={(value) =>
                    setReport((prev) => ({ ...prev, problem: value }))
                  }
                  validate={(value) => {
                    const result = problemSchema.safeParse(value);
                    return result.success
                      ? null
                      : result.error.issues[0].message;
                  }}
                >
                  <TextArea placeholder={placeholder} />
                </TextField>
              </Form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default ReportModal;
