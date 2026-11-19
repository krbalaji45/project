import { Routes, Route, Navigate } from "react-router-dom";
import AuthApp from "./auth/AuthApp";
import OnboardingApp from "./onboarding/OnboardingApp";
import DashboardApp from "./dashboard/DashboardApp";
import StockLevels from "./inventory/stocklevel/StockLevels";
import BulkInventory from "./inventory/BulkInventory/BulkInventory";
import LowStockAlerts from "./inventory/lowstockinventory/LowStockAlerts";
import WithdrawalRequest from "./withdrawal/withdrawalrequest/withdrawalrequest.jsx";
import EarningsOverview from "./withdrawal/earningsoverview/earningsoverview.jsx";
import CommissionTracking from "./withdrawal/commission/commissiontracking.jsx";
import HelpCenter, {
  HelpArticle,
  HelpCategory,
} from "./help&support/vendorinterface/helpcenter.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login/*" element={<AuthApp />} />
      <Route path="/vendor-onboarding/*" element={<OnboardingApp />} />
      <Route path="/bulk" element={<Navigate to="/inventory/bulk" replace />} />
      <Route path="/inventory/stock-levels" element={<StockLevels />} />
      <Route path="/inventory/bulk" element={<BulkInventory />} />
      <Route path="/inventory/low-stock" element={<LowStockAlerts />} />
      <Route
        path="/kyc-details"
        element={<Navigate to="/vendor-onboarding/kyc-details" replace />}
      />
      <Route path="/dashboard/*" element={<DashboardApp />} />
      <Route path="/withdrawalrequest" element={<WithdrawalRequest />} />
      <Route path="/withdrawalearningsoverview" element={<EarningsOverview />} />
      <Route path="/withdrawalcommissionoverview" element={<CommissionTracking />} />
      <Route path="/help-center/raise-ticket" element={<HelpCenter />} />
      <Route path="/help-center/contact-admin" element={<HelpCenter />} />
      <Route path="/help-center/ticket-history" element={<HelpCenter />} />
      <Route path="/help-center/categories/:categorySlug" element={<HelpCategory />} />
      <Route path="/help-center/articles/:articleId" element={<HelpArticle />} />
      <Route path="/help-center/*" element={<HelpCenter />} />

    </Routes>
  );
}