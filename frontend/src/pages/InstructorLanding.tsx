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
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-50 dark:opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(60.92% 0.214 256.89 / 0.5), transparent 60%)",
        }}
      />
      <div className="flex flex-col items-center justify-center gap-6 sm:min-h-[90vh] min-h-[80vh] relative max-w-7xl mx-auto">
        <Chip className="border text-muted rounded-full text-xs bg-surface z-10">
          <Stars size={12} className="mr-2 text-accent" /> Teach with confidence
        </Chip>
        <h1 className="md:text-7xl sm:text-5xl text-4xl font-extrabold tracking-tighter text-center font-kaushan-script">
          Build
          <br />
          <span className="bg-linear-to-b from-accent-soft via-accent/50 to-accent dark:from-[#D6E8FF] dark:via-[#60A5FA] dark:to-accent bg-clip-text font-limelight text-transparent">
            Courses
          </span>
          <br />
          That Learners Love
          <span className="md:text-6xl sm:text-5xl text-4xl"> ❤️</span>
        </h1>
        <p className="text-light sm:text-xl text-sm text-muted text-center w-2/3">
          Build professional courses from one intuitive platform
        </p>
        <div className="flex items-center sm:gap-4 gap-2 mt-6">
          <Link
            to="/register"
            className="button bg-linear-to-t from-accent to-accent/50 text-white ring-visible-offset"
          >
            Start Teaching
          </Link>
          <a
            href="#features"
            className="button button--outline group ring-visible-offset"
          >
            Explore Features
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="flex max-sm:flex-wrap items-center max-sm:justify-center sm:gap-4 gap-2 text-xs text-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-success inline" size={16} />
            Publish courses with ease
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-success inline" size={16} />
            Create videos, notes & quizzes
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-success inline" size={16} />
            Manage everything in one place
          </div>
        </div>
        <button
          className="animate-bounce absolute bottom-10 left-1/2 -translate-x-1/2 hover:border p-2 rounded-full"
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

function InstructorLanding() {
  return (
    <div>
      <Hero />
      <Features role="instructor" />
      <Learn role="instructor" />
      <Connect role="instructor" />
      <Flexibility role="instructor" />
      <CTA role="instructor" />
    </div>
  );
}

export default InstructorLanding;
