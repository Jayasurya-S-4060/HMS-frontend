import "./App.css";
import Header from "./components/Header";
import { Layout } from "antd";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MenuAuthComp from "./components/AuthComp.jsx";

// Pages
import { Rooms } from "./pages";
import RoomDetails from "./pages/RoomDetails";
import Users from "./pages/users";
import UserDetails from "./pages/UserDetails";
import MyProfile from "./pages/MyProfile";
import LoginForm from "./pages/LoginForm";
import { ForgotPassword, ResetPassword } from "./pages/ResetForm";
import RegisterForm from "./pages/RegisterForm";
import Requests from "./pages/MainRequests";
import FinancialManagement from "./pages/FinancialReport";
import AdminNotifications from "./pages/AdminNotifications";
import ViewNotifications from "./pages/viewNotifications";
import PaymentSuccess from "./pages/payment-success";
import PaymentFailed from "./pages/payment-failed";
import GeneratePayment from "./pages/GeneratePayment";
import PaymentList from "./pages/PaymentList";
import UserPayments from "./pages/UserPayments";
import PaymentPage from "./pages/PaymentPage";
import Sidebar from "./components/Sidebar.jsx";
import { motion } from "framer-motion";

import LoginIcon from "../src/assets/login.jsx";

const { Content } = Layout;

function App() {
  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/*" element={<UserAuthentication />} />
        <Route path="/app/*" element={<Wrapper />} />
      </Routes>
    </div>
  );
}
const UserAuthentication = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 p-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col md:flex-row bg-white/30 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-xl w-full max-w-lg md:max-w-5xl border border-white/50 relative overflow-hidden"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 pointer-events-none"></div>

      <div className="hidden md:flex flex-col items-center justify-center pr-8 border-r border-white/40 relative z-10">
        <LoginIcon width={150} height={75} />
        <h2 className="text-3xl font-bold text-gray-700 drop-shadow-sm">
          Welcome!
        </h2>
        <p className="text-gray-600 mt-3 text-center px-4 leading-relaxed">
          Start managing your account effortlessly.
        </p>
      </div>

      <div className="w-full mt-4 md:mt-0 md:pl-8 relative z-10">
        <Routes>
          <Route path="login" element={<LoginForm />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="register"
              element={
                <MenuAuthComp compName="user-registration">
                  <RegisterForm />
                </MenuAuthComp>
              }
            />
          </Route>
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </motion.div>
  </div>
);

const Wrapper = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Layout style={{ flexDirection: "row" }}>
        <Sidebar /> {/* Sidebar on the left */}
        <Layout style={{ flex: 1, overflow: "hidden" }}>
          <Header />
          <Content
            style={{ padding: 24, margin: 0, overflow: "auto", height: "100%" }}
          >
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/rooms"
                  element={
                    <MenuAuthComp compName="hostel-management">
                      <Rooms />
                    </MenuAuthComp>
                  }
                />
                <Route
                  path="/room/:id"
                  element={
                    <MenuAuthComp compName="hostel-management">
                      <RoomDetails />
                    </MenuAuthComp>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <MenuAuthComp compName="user-management">
                      <Users />
                    </MenuAuthComp>
                  }
                />
                <Route
                  path="/users/:id"
                  element={
                    <MenuAuthComp compName="user-management">
                      <UserDetails />
                    </MenuAuthComp>
                  }
                />
                <Route
                  path="/myProfile"
                  element={
                    <MenuAuthComp compName="profile">
                      <MyProfile />
                    </MenuAuthComp>
                  }
                />
                <Route
                  path="/maintenanceRequests"
                  element={
                    <MenuAuthComp compName="hostel-management">
                      <Requests />
                    </MenuAuthComp>
                  }
                />
                <Route
                  path="/financialManagement"
                  element={
                    <MenuAuthComp compName="financial-management">
                      <FinancialManagement />
                    </MenuAuthComp>
                  }
                />
              </Route>
              <Route
                path="/admin-notifications"
                element={
                  <MenuAuthComp compName="notification-management">
                    <AdminNotifications />
                  </MenuAuthComp>
                }
              />
              <Route path="/notifications" element={<ViewNotifications />} />
              <Route
                path="/userPayments/payment"
                element={
                  <MenuAuthComp compName="user-payments">
                    <PaymentPage />
                  </MenuAuthComp>
                }
              />
              <Route
                path="/userPayments/success"
                element={
                  <MenuAuthComp compName="user-payments">
                    <PaymentSuccess />
                  </MenuAuthComp>
                }
              />
              <Route
                path="/userPayments/failure"
                element={
                  <MenuAuthComp compName="user-payments">
                    <PaymentFailed />
                  </MenuAuthComp>
                }
              />
              <Route
                path="/paymentManagement/generatePayment"
                element={
                  <MenuAuthComp compName="payment-management">
                    <GeneratePayment />
                  </MenuAuthComp>
                }
              />
              <Route
                path="/paymentManagement/paymentList"
                element={
                  <MenuAuthComp compName="payment-management">
                    <PaymentList />
                  </MenuAuthComp>
                }
              />
              <Route
                path="/userPayments"
                element={
                  <MenuAuthComp compName="user-payments">
                    <UserPayments />
                  </MenuAuthComp>
                }
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
