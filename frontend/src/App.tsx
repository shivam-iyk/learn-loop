import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toast } from "@heroui/react";
import Home from "./pages/Home";
import AppLayout from "./layouts/AppLayout";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Earnings from "./pages/Earnings";
import Explore from "./pages/Explore";
import MyCourses from "./pages/MyCourses";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Course from "./pages/Course";
import Instructor from "./pages/Instructor";
import CreateCourse from "./pages/CreateCourse";
import Connect from "./pages/Connect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import LandingLayout from "./layouts/LandingLayout";
import InstructorLanding from "./pages/InstructorLanding";
import AuthLayout from "./layouts/AuthLayout";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyCode from "./pages/VerifyCode";
import Lesson from "./pages/Lesson";

function App() {
  return (
    <div className="min-h-screen w-full">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          <Route element={<ForgotPassword />} path="/forgot-password" />
          <Route element={<VerifyCode />} path="/verify-code" />
        </Route>

        <Route element={<LandingLayout />}>
          <Route element={<Landing />} path="/" />
          <Route element={<InstructorLanding />} path="/instructor" />
        </Route>
        <Route element={<AppLayout />}>
          <Route element={<CreateCourse />} path="/create-course" />
          <Route element={<Course />} path="/course/:courseId" />
          <Route
            element={<Lesson />}
            path="/course/:courseId/lesson/:lessonId"
          />
          <Route element={<Courses />} path="/courses" />
          <Route element={<Dashboard />} path="/dashboard" />
          <Route element={<Earnings />} path="/earnings" />
          <Route element={<Explore />} path="/explore" />
          <Route element={<Home />} path="/home" />
          <Route element={<MyCourses />} path="/my-courses" />
          <Route element={<Profile />} path="/profile" />
          <Route element={<Connect />} path="/connect" />
          <Route element={<Connect />} path="/connect/:chatId" />
          <Route element={<Instructor />} path="/instructor/:instructorId" />
          <Route element={<Settings />} path="/settings" />
        </Route>
      </Routes>
      <Toast.Provider />
    </div>
  );
}

export default App;
