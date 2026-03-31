import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import OtpVerify from "./pages/OtpVerify";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import StudentDashboard from "./pages/Student/StudentDashboard";
import InstructorDashboard from "./pages/Instructor/InstructorDashboard";
import CreateCourse from "./pages/Instructor/CreateCourse";
import { useAppDispatch } from "./redux/hooks";
import { useEffect } from "react";
import { checkAuth } from "./redux/userSlice";
import EditCourse from "./pages/Instructor/EditCourse";
import AllCourses from "./pages/AllCourses";
import CourseDetails from "./pages/CourseDetails";
import EnrollmentSuccess from "./pages/Student/EnrollmentSuccess";
import MyLearning from "./pages/Student/MyLearning";
import Certificate from "./pages/Student/Certificate";
import About from "./pages/AboutPage";
import LandingPage from "./pages/LandingPage";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  return (
    <>
      {/* common routs */}
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
        </Route>

        {/* user routs */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/all-courses" element={<AllCourses />} />
          <Route path="/course-details/:courseId" element={<CourseDetails />} />
          <Route path="/about" element={<About />} />
          {/* student routs */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/enrollment-success" element={<EnrollmentSuccess />} />
          <Route path="/my-learning/:courseId" element={<MyLearning />} />
          <Route path="/certificate/:courseId" element={<Certificate />} />
          {/* instructor routs */}
          <Route
            path="/instructor-dashboard"
            element={<InstructorDashboard />}
          />
          <Route path="/create-Course" element={<CreateCourse />} />
          <Route path="/edit-course/:courseId" element={<EditCourse />} />{" "}
        </Route>
      </Routes>
    </>
  );
}

export default App;
