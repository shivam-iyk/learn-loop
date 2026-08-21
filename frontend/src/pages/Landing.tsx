import { Chip } from "@heroui/react";
import { ArrowRight, CheckCircle2, ChevronDown, Stars } from "lucide-react";
import { lazy } from "react";
import { Link } from "react-router-dom";

const Features = lazy(() => import("../components/Features"));
const Learn = lazy(() => import("../components/Learn"));
const Connect = lazy(() => import("../components/Connect"));
const Flexibility = lazy(() => import("../components/Flexibility"));
const CTA = lazy(() => import("../components/CTA"));

function Hero() {
  return (
    <section
      className="relative overflow-hidden sm:px-6 px-4 scroll-mt-16"
      id="home"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(60.92% 0.214 256.89 / 0.5), transparent 60%)",
        }}
      />
      <div className="flex flex-col items-center justify-center gap-6 sm:min-h-[90vh] min-h-[80vh] relative max-w-7xl mx-auto">
        <Chip className="border text-muted rounded-full text-xs bg-white z-10">
          <Stars size={12} className="mr-2 text-accent" /> Learn at your own
          pace
        </Chip>
        <h1 className="md:text-7xl sm:text-5xl text-4xl font-extrabold tracking-tighter text-center font-kaushan-script">
          Your
          <br />
          <span className="bg-linear-to-b from-accent-soft via-accent/50 to-accent bg-clip-text font-limelight text-transparent">
            Learning Journey
          </span>
          <br />
          Starts Here
          <span className="md:text-6xl sm:text-5xl text-4xl"> 🚀</span>
        </h1>
        <p className="text-light sm:text-xl text-sm text-muted text-center">
          Explore interactive courses, quizzes, and notes—all in one place
        </p>
        <div className="flex items-center sm:gap-4 gap-2 mt-6">
          <Link
            to="/register"
            className="button bg-linear-to-t from-accent to-accent/50 text-white ring-visible-offset"
          >
            Start Learning
          </Link>
          <Link
            to="/explore"
            className="button button--outline group ring-visible-offset"
          >
            Explore Courses
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="flex max-sm:flex-wrap items-center max-sm:justify-center sm:gap-4 gap-2 text-xs text-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-success inline" size={16} />
            No subscription required
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-success inline" size={16} />
            Free courses available
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-success inline" size={16} />
            Track your progress
          </div>
        </div>
        <button
          className="animate-bounce absolute bottom-2 left-1/2 -translate-x-1/2 hover:border p-2 rounded-full"
          onClick={() =>
            window.scrollTo({
              top: document.querySelector("#home")?.scrollHeight,
            })
          }
        >
          <ChevronDown strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}

function Landing() {
  return (
    <div>
      <Hero />
      <Features role="student" />
      <Learn role="student" />
      <Connect role="student" />
      <Flexibility role="student" />
      <CTA role="student" />
    </div>
  );
}

export default Landing;
