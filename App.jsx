import { Routes, Route, Navigate } from "react-router-dom";
import AuthApp from "./auth/AuthApp";
import OnboardingApp from "./onboarding/OnboardingApp";
import DashboardApp from "./dashboard/DashboardApp";
import WithdrawalRequest from "./withdrawal/withdrawalrequest/withdrawalrequest";
import WithdrawalEarningsOverview from "./withdrawal/earningsoverview/earningsoverview";
import WithdrawalCommissionOverview from "./withdrawal/commission/commissiontracking";
import HelpCenter, {
  HelpArticle,
  HelpCategory,
} from "./help&support/vendorinterface/helpcenter";
import RaiseTicket from "./help&support/raiseticket/raiseticket";
import ContactAdmin from "./help&support/contectadmin/contectadmin";
import TicketHistory from "./help&support/tickethistory/tickethistory";

import BulkInventory from "./inventory/BulkInventory/BulkInventory";
import LowStockAlerts from "./inventory/lowstockinventory/LowStockAlerts";
import StockLevels from "./inventory/stocklevel/StockLevels";
import DiningRegistration from "./registration/dining/DiningRegistration";
import StoresRegistration from "./registration/stores/StoresRegistration";
import ActivitiesRegistration from "./registration/activities/ActivitiesRegistration";
import PlayRegistration from "./registration/play/PlayRegistration";
import EventsRegistration from "./registration/eventsregistration/EventsRegistration";
import SecuritySessions from "./logout/securitysessions";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login/*" element={<AuthApp />} />
      <Route path="/vendor-onboarding/*" element={<OnboardingApp />} />
      <Route path="/dashboard/*" element={<DashboardApp />} />
      <Route path="/withdrawalrequest" element={<WithdrawalRequest />} />
      <Route path="/withdrawalearningsoverview" element={<WithdrawalEarningsOverview />} />
      <Route path="/withdrawalcommissionoverview" element={<WithdrawalCommissionOverview />} />
      <Route path="/help-center/contact-admin" element={<ContactAdmin />} />
      <Route path="/help-center/ticket-history" element={<TicketHistory />} />
      <Route path="/help-center/categories/:categorySlug" element={<HelpCategory />} />
      <Route path="/help-center/articles/:articleId" element={<HelpArticle />} />
      <Route path="/help-center/*" element={<HelpCenter />} />
      <Route path="/bulk-inventory" element={<BulkInventory />} />
      <Route path="/low-stock-alert" element={<LowStockAlerts />} />
      <Route path="/stock-levels" element={<StockLevels />} />
      <Route path="/registration" element={<DiningRegistration />} />
      <Route
        path="/registration/diningregistration"
        element={<Navigate to="/registration" replace />}
      />
      <Route
        path="/registration/storesregistration"
        element={<StoresRegistration />}
      />
      <Route
        path="/registration/activitiesregistration"
        element={<ActivitiesRegistration />}
      />
      <Route
        path="/registration/playregistration"
        element={<PlayRegistration />}
      />
      <Route
        path="/registration/eventsregistration"
        element={<EventsRegistration />}
      />
      <Route path="/security-sessions" element={<SecuritySessions />} />
      <Route
        path="/logout"
        element={<Navigate to="/security-sessions" replace />}
      />
    </Routes>
  );
}