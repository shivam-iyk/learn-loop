import { Button, Label, TextArea, TextField, toast } from "@heroui/react";
import { useMemo, useState } from "react";
import StarsSelector from "./StarsSelector";
import useAppStore from "../store";

function RateCourse({ courseId }: { courseId?: string }) {
  const { enrolledCourses } = useAppStore();

  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success("Thanks for your review");
  };

  const isEnrolled = useMemo(() => {
    const id = parseInt(courseId || "0");
    if (!courseId) return false;
    return enrolledCourses.some((item) => item.id === id);
  }, []);

  if (submitted || isEnrolled) {
    return null;
  }

  return (
    <div className="bg-background/50 p-4 rounded-lg">
      <h4 className="text-xl font-outfit font-semibold tracking-tight">
        Rate this Course
      </h4>
      <p className="text-sm text-muted">
        Share your valuable experience with us
      </p>
      <div className="flex flex-col gap-4">
        <StarsSelector
          value={rating}
          setValue={(value) => setRating(value)}
          className="justify-around gap-2 mt-4"
          buttonClassName="p-1"
          size={30}
        />
        <TextField name="review">
          <Label>
            Review <span className="text-xs text-muted">(Optional)</span>
          </Label>
          <TextArea placeholder="Write your review" />
        </TextField>
        <Button
          className="w-full mt-2"
          onClick={handleSubmit}
          isDisabled={rating === 0}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default RateCourse;
