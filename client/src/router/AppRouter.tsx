import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import VerifyOTPPage from "@/pages/VerifyOTPPage";
import EventsPage from "@/pages/EventsPage";
import PrivateRoute from "./PrivateRoute";
import CreateEventPage from "@/pages/CreateEventPage";
import EventDetailsPage from "@/pages/EventDetailsPage";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event" element={<EventDetailsPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <VerifyOTPPage />
              </PublicRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <PrivateRoute>
                <CreateEventPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;
