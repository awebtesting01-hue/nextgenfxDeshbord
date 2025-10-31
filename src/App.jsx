import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import VerifyOtp from "./pages/VerifyOtp";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import Layout from "./layout/Layout";
import Dashboard from "./Dashboard/Dashboard";
import Referral from "./Dashboard/Referral";
import Team from "./Dashboard/Team";
import Earnings from "./Dashboard/Earnings";
import Wallet from "./Dashboard/Wallet";
import PayoutHistory from "./Dashboard/PayoutHistory";
import HelpSupport from "./Dashboard/HelpSupport";
import Profile from "./Dashboard/Profile";
import OrgChart from "./components/OrgChart";
import FilterPanel from "./components/FilterPanel";
import AddWallet from "./Dashboard/AddWallet";
import TransferWallet from "./Dashboard/TransferWallet";
import WithdrawalRequest from "./Dashboard/WithdrawalRequest";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import RegistrationSuccess from "./components/RegistrationSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import UserWalletRequests from "./Dashboard/UserWalletRequests";
import LiveEarning from "./Dashboard/LiveEarning";
import InvestmentAccount from "./Dashboard/InvestmentAccount";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/:referralId" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />

        {/* Protected routes with Layout wrapper */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/team" element={<Team />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/live-earnings" element={<LiveEarning />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/payout-history" element={<PayoutHistory />} />
          <Route path="/investment-account" element={<InvestmentAccount />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/OrgChart" element={<OrgChart />} />
          <Route path="/FilterPanel" element={<FilterPanel />} />
          <Route path="/wallet/add" element={<AddWallet />} />
          <Route path="/wallet/pending" element={<UserWalletRequests />} />
          <Route path="/wallet/transfer" element={<TransferWallet />} />
          <Route path="/wallet/withdraw" element={<WithdrawalRequest />} />
        </Route>

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
