import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function CTA({ role }: { role: "student" | "instructor" }) {
  return (
    <div className="bg-background py-10 group/section sm:px-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex max-md:flex-col justify-between gap-4 rounded-[30px] bg-linear-to-r from-accent/70 to-accent-soft-hover md:p-20 sm:p-16 p-12 group-hover/section:scale-[102%] transition-transform">
          <div>
            <h2 className="md:text-6xl text-4xl font-bold font-outfit tracking-tighter text-white">
              Ready to Start {role === "student" ? "Learning" : "Teaching"}?
            </h2>
            <p className="text-xl text-white font-merriweather mt-4">
              {role === "student"
                ? "Join LearnLoop today and begin building the skills that matter."
                : "Share your expertise, inspire learners, and build impactful courses with LearnLoop."}
            </p>
          </div>
          <div className="flex gap-6 mt-8">
            <Link
              to="/login"
              className="flex items-center gap-2 bg-background border pl-4 px-3 py-2 w-44 h-12 rounded-full group relative ring-visible"
            >
              <span className="absolute">
                Start {role === "student" ? "Learning" : "Teaching"}
              </span>
              <span className="rounded-full size-10 absolute flex items-center justify-center right-[calc(0.25rem-1px)] transition-all bg-linear-to-t from-accent to-accent/50 backdrop-blur-sm text-white group-hover:w-42 group-focus-visible:w-42 z-10">
                <ChevronRight className="inline" size={20} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTA;
