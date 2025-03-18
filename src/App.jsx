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
import ViewNotifications from "./pages/ViewNotifications";
import PaymentSuccess from "./pages/payment-success";
import PaymentFailed from "./pages/payment-failed";
import GeneratePayment from "./pages/GeneratePayment";
import PaymentList from "./pages/PaymentList";
import UserPayments from "./pages/UserPayments";
import PaymentPage from "./pages/PaymentPage";
import Sidebar from "./components/Sidebar.jsx";

import FormLayout from "./components/LayoutWrapper.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const { Content } = Layout;

function App() {
  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/auth/*"
          element={
            <AuthProvider>
              <AuthComp />
            </AuthProvider>
          }
        />
        <Route
          path="/app/*"
          element={
            <AuthProvider>
              <AppComp />
            </AuthProvider>
          }
        />
      </Routes>
    </div>
  );
}

const AuthComp = () => (
  <FormLayout>
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
    </Routes>
  </FormLayout>
);

const AppComp = () => {
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
