import { CircleCheck, Users } from "lucide-react";

function Connect({ role }: { role: "student" | "instructor" }) {
  const highlights =
    role === "student"
      ? [
          "Learn Beyond Lessons",
          "Connect. Learn. Grow.",
          "Your Learning Community",
          "Every Course Has a Community",
        ]
      : [
          "Every Great Course Builds a Community",
          "Teach Beyond the Lesson",
          "Bring Learners Together",
          "More Than Just a Course",
          "Build Learning Communities",
        ];

  const chats = [
    {
      name: "Priya",
      text: "Anyone else confused on useEffect cleanup?",
      time: "3h ago",
    },
    {
      name: "You",
      text: role === "student" ? "Can someone explain Closures?": "Guys, I will share resources by today",
      time: "2h ago",
    },
    {
      name: "Aman",
      tag: "Priya",
      text: "I will share an example",
      time: "2h ago",
    },
    {
      name: "Priya",
      tag: "Aman",
      text: "Thanks",
      time: "2h ago",
    },
  ];

  return (
    <section
      className="border-t bg-accent sm:px-6 px-4 scroll-mt-16"
      id="connect"
    >
      <div className="grid md:grid-cols-2 gap-16 py-20 max-w-7xl mx-auto">
        <div>
          <span className="font-huninn uppercase text-foreground tracking-tighter">
            {role === "student" ? "Learning Together" : "Build your Community"}
          </span>
          <h2 className="text-3xl tracking-tighter font-bold font-outfit text-background">
            {role === "student"
              ? "Learn Beyond the Classroom"
              : "Turn Students into a Community"}
          </h2>
          <p className="text-background mt-4">
            Bring your learners together in one place. Encourage discussions,
            answer questions, and build an active learning community beyond your
            course content.
          </p>
          <ul className="flex flex-col gap-2 mt-6">
            {highlights.map((item, index) => (
              <li className="flex items-center gap-1 text-foreground" key={index}>
                <CircleCheck className="text-green-400" size={20} /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-background w-full rounded-4xl">
          <div className="flex items-center font-outfit font-medium tracking-tight gap-2 p-4 border-b">
            <Users className="text-accent" size={20} />
            React.js Tutorial
          </div>
          <div className="flex flex-col gap-2 p-4">
            {chats.map((item, index) => (
              <div className="flex flex-col" key={index}>
                <div 
                  className={`flex flex-col ${item.name === "You" ? "self-end bg-accent text-white" : "bg-background-tertiary self-start pt-1.5"} max-w-4/5 p-3 rounded-4xl`}
                  key={index}
                >
                  <span
                    className={`font-outfit text-xs text-accent ${item.name === "You" ? "hidden" : ""}`}
                  >
                    {item.name}
                  </span>
                  <p className="text-sm">{item.text}</p>
                </div>
                <span
                  className={`${item.name === "You" ? "hidden" : ""} text-xs text-muted ml-2`}
                >
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Connect;
