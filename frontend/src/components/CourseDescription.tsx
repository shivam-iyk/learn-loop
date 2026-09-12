import useAppStore from "../store";

function CourseDescription() {
  const { course } = useAppStore();
  return (
    <div className="p-4 bg-background/50 rounded-lg">
      <h4 className="text-xl font-semibold tracking-tight font-outfit">Description</h4>
      <p className="font-quicksand mt-2">{course.description}</p>
    </div>
  );
}

export default CourseDescription;
