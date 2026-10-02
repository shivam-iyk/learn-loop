import { useSortable } from "@dnd-kit/react/sortable";
import { Button } from "@heroui/react";
import { GripVertical, Trash } from "lucide-react";
import type { ReactNode } from "react";
import useAppStore from "../store";
import OptionField from "./OptionField";

interface OptionRowProps {
  id: number;
  index: number;
  questionId: number;
  option: string;
  control?: ReactNode;
  hideGrip?: boolean;
  hideDelete?: boolean;
  deleteDisabled?: boolean;
  inputDisabled?: boolean;
  onDelete?: () => void;
}

function OptionRow({
  id,
  index,
  questionId,
  option,
  control,
  hideGrip = false,
  hideDelete = false,
  deleteDisabled = false,
  inputDisabled = false,
  onDelete,
}: OptionRowProps) {
  const removeOption = useAppStore((s) => s.removeOption);
  const handleOptionChange = useAppStore((s) => s.handleOptionChange);
  const { ref, handleRef } = useSortable({ id, index });

  return (
    <div className="flex items-center gap-2" ref={ref}>
      {control}
      <OptionField
        name={`option-${questionId}-${id}`}
        value={option}
        onChange={(value) => handleOptionChange(value, questionId, id)}
        disabled={inputDisabled}
      />
      {!hideGrip && (
        <Button
          variant="tertiary"
          ref={handleRef}
          className="hover:cursor-grab"
          isIconOnly
        >
          <GripVertical />
        </Button>
      )}
      {!hideDelete && (
        <Button
          variant="danger-soft"
          isIconOnly
          isDisabled={deleteDisabled}
          onClick={onDelete ?? (() => removeOption(questionId, id))}
        >
          <Trash />
        </Button>
      )}
    </div>
  );
}

export default OptionRow;
