import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterWithToken from "./components/Register/RegisterForm";
import SignIn from "./components/SignIn/SignIn";
import UpdatePassword from "./components/SignIn/UpdatePassword";
import ForgetPassword from "./components/SignIn/ForgotPassword";
import Layout from "./components/Layout";
import OnboardingForm from "./components/OnboardingForm";
import HRDashboard from "./components/HRDashboard/HRDashboard";
import EmployeeDashboard from './components/EmployeeDashboard/EmployeeDashboard'
import ViewApplicationPage from "./components/HRDashboard/ViewApplication";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from './features/user';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      dispatch(setCurrentUser(parsedUser));
    }
    setIsLoaded(true)
  }, [dispatch]);

  return (
    isLoaded ? (
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<div>Hello</div>} />
        <Route path="/register/:token" element={<RegisterWithToken />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/onboarding' element={<OnboardingForm />} />
        <Route path='/hr/dashboard' element={<HRDashboard />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path='/update-password/:token' element={<UpdatePassword />} />
        <Route path='/hr/view-application/:userId' element={<ViewApplicationPage />} />
         <Route path='/employee/dashboard' element={<EmployeeDashboard />} />
        </Route>
      </Routes>
  ): (
    <div>Loading...</div>
  )
);
}

export default App;
