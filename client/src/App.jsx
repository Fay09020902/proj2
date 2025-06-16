import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterWithToken from "./components/Register/RegisterForm";
import SignIn from "./components/SignIn/SignIn";
import UpdatePassword from "./components/SignIn/UpdatePassword";
import ForgetPassword from "./components/SignIn/ForgotPassword";
import Layout from "./components/Layout";
import OnboardingForm from "./components/OnboardingForm";
import HRDashboard from "./components/HRDashboard/HRDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard/EmployeeDashboard";
import ViewApplicationPage from "./components/HRDashboard/ViewApplication";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./features/user";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          dispatch(setCurrentUser(res.data));
        })
        .catch((err) => console.error("Failed to fetch user:", err));
    }
    setIsLoaded(true);
  }, [dispatch]);

  return isLoaded ? (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/register/:token" element={<RegisterWithToken />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/update-password/:token" element={<UpdatePassword />} />
        <Route path="/signin" element={<SignIn />} />

        <Route element={<ProtectedRoute allowedRoles={["HR"]} />}>
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route
            path="/hr/view-application/:userId"
            element={<ViewApplicationPage />}
          />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Employee"]} />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
        </Route>
      </Route>
    </Routes>
  ) : (
    <div>Loading...</div>
  );
}

export default App;
