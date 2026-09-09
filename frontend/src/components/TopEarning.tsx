import { Link } from "react-router-dom";

function TopEarning() {
  const revenue = [
    {
      id: 1,
      cover:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1780987669/lms/course/yndzt0xxjwmgkyrucwqy.jpg",
      course: "React Tutorial",
      tagline: "Learn with us",
      value: 2300,
    },
    {
      id: 1,
      cover:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1780988065/lms/course/fegjy1rmynrizittty3p.jpg",
      course: "Styling with CSS",
      tagline: "Learn with us",
      value: 7500,
    },
    {
      id: 1,
      cover:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1780988197/lms/course/hcghp49jrk9favwtukme.jpg",
      course: "React Tutorial",
      tagline: "Learn with us",
      value: 2000,
    },
  ];

  return (
    <div className="w-full">
      <h4 className="text-xl font-outfit font-semibold tracking-tight">
        Top Earning
      </h4>
      <div className="flex flex-col gap-2 mt-4">
        {revenue.map((item, index) => (
          <Link
          to={`/course/${item.id}`}
            className="flex items-center bg-background rounded-lg gap-3 p-1"
            key={index}
          >
            <img src={item.cover} className="size-24 object-cover rounded-sm" />
            <div className="flex flex-col justify-between gap-2 p-2 pl-0">
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-medium font-outfit tracking-tight truncate">
                  {item.course}
                </p>
                <span className="text-xs text-muted truncate">
                  {item.tagline}
                </span>
              </div>
              <span className="text-accent font-semibold text-xl">
                {item.value.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopEarning;
