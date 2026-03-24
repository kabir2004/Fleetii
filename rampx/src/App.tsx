import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import { MarketingLayout } from '@/components/layouts/MarketingLayout'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { OnboardingLayout } from '@/components/layouts/OnboardingLayout'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

// Marketing
import LandingPage from '@/pages/marketing/LandingPage'
import PricingPage from '@/pages/marketing/PricingPage'
import AboutPage from '@/pages/marketing/AboutPage'

// Auth
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Onboarding
import OnboardingWelcome from '@/pages/onboarding/OnboardingWelcome'
import OnboardingCompany from '@/pages/onboarding/OnboardingCompany'
import OnboardingFleet from '@/pages/onboarding/OnboardingFleet'
import OnboardingIntegrations from '@/pages/onboarding/OnboardingIntegrations'
import OnboardingTeam from '@/pages/onboarding/OnboardingTeam'
import OnboardingComplete from '@/pages/onboarding/OnboardingComplete'

// Dashboard
import OverviewPage from '@/pages/dashboard/OverviewPage'

// Loads
import LoadsListPage from '@/pages/dashboard/loads/LoadsListPage'
import LoadDetailPage from '@/pages/dashboard/loads/LoadDetailPage'
import CreateLoadPage from '@/pages/dashboard/loads/CreateLoadPage'
import LoadBoardPage from '@/pages/dashboard/loads/LoadBoardPage'

// Fleet
import FleetOverviewPage from '@/pages/dashboard/fleet/FleetOverviewPage'
import VehicleDetailPage from '@/pages/dashboard/fleet/VehicleDetailPage'
import MaintenancePage from '@/pages/dashboard/fleet/MaintenancePage'

// Drivers
import DriversListPage from '@/pages/dashboard/drivers/DriversListPage'
import DriverDetailPage from '@/pages/dashboard/drivers/DriverDetailPage'
import DriverPayPage from '@/pages/dashboard/drivers/DriverPayPage'

// Finance
import SpendOverviewPage from '@/pages/dashboard/finance/SpendOverviewPage'
import InvoicesPage from '@/pages/dashboard/finance/InvoicesPage'
import InvoiceDetailPage from '@/pages/dashboard/finance/InvoiceDetailPage'
import PaymentsPage from '@/pages/dashboard/finance/PaymentsPage'
import BillingPage from '@/pages/dashboard/finance/BillingPage'
import FuelCardsPage from '@/pages/dashboard/finance/FuelCardsPage'
import SavingsPage from '@/pages/dashboard/finance/SavingsPage'
import PayrollPage from '@/pages/dashboard/finance/PayrollPage'
import CashFlowPage from '@/pages/dashboard/finance/CashFlowPage'

// Analytics
import AnalyticsDashboard from '@/pages/dashboard/analytics/AnalyticsDashboard'
import LaneAnalyticsPage from '@/pages/dashboard/analytics/LaneAnalyticsPage'
import CarrierScorecard from '@/pages/dashboard/analytics/CarrierScorecard'
import ReportsPage from '@/pages/dashboard/analytics/ReportsPage'

// Insights
import DriverPerformancePage from '@/pages/dashboard/insights/DriverPerformancePage'
import ProfitabilityPage from '@/pages/dashboard/insights/ProfitabilityPage'
import FuelIntelligencePage from '@/pages/dashboard/insights/FuelIntelligencePage'
import RevenueForecastPage from '@/pages/dashboard/insights/RevenueForecastPage'
import HealthScorePage from '@/pages/dashboard/insights/HealthScorePage'

// Compliance
import ComplianceDashboard from '@/pages/dashboard/compliance/ComplianceDashboard'
import DocumentsPage from '@/pages/dashboard/compliance/DocumentsPage'
import SafetyPage from '@/pages/dashboard/compliance/SafetyPage'

// Settings
import SettingsLayout from '@/pages/dashboard/settings/SettingsLayout'
import ProfilePage from '@/pages/dashboard/settings/ProfilePage'
import CompanyPage from '@/pages/dashboard/settings/CompanyPage'
import TeamPage from '@/pages/dashboard/settings/TeamPage'
import IntegrationsPage from '@/pages/dashboard/settings/IntegrationsPage'
import NotificationsPage from '@/pages/dashboard/settings/NotificationsPage'
import BillingSettingsPage from '@/pages/dashboard/settings/BillingSettingsPage'

// Other
import NotFoundPage from '@/pages/NotFoundPage'
import InboxPage from '@/pages/dashboard/InboxPage'
import VendorsPage from '@/pages/dashboard/VendorsPage'
import ReferPage from '@/pages/dashboard/ReferPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Marketing */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Onboarding */}
          <Route element={<OnboardingLayout />}>
            <Route path="/onboarding" element={<OnboardingWelcome />} />
            <Route path="/onboarding/company" element={<OnboardingCompany />} />
            <Route path="/onboarding/fleet" element={<OnboardingFleet />} />
            <Route path="/onboarding/integrations" element={<OnboardingIntegrations />} />
            <Route path="/onboarding/team" element={<OnboardingTeam />} />
            <Route path="/onboarding/complete" element={<OnboardingComplete />} />
          </Route>

          {/* Dashboard */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<OverviewPage />} />
            <Route path="/dashboard/inbox" element={<InboxPage />} />
            <Route path="/dashboard/vendors" element={<VendorsPage />} />
            <Route path="/dashboard/refer" element={<ReferPage />} />

            <Route path="/dashboard/loads" element={<LoadsListPage />} />
            <Route path="/dashboard/loads/new" element={<CreateLoadPage />} />
            <Route path="/dashboard/loads/:id" element={<LoadDetailPage />} />
            <Route path="/dashboard/load-board" element={<LoadBoardPage />} />

            <Route path="/dashboard/fleet" element={<FleetOverviewPage />} />
            <Route path="/dashboard/fleet/maintenance" element={<MaintenancePage />} />
            <Route path="/dashboard/fleet/:id" element={<VehicleDetailPage />} />

            <Route path="/dashboard/drivers" element={<DriversListPage />} />
            <Route path="/dashboard/drivers/pay" element={<DriverPayPage />} />
            <Route path="/dashboard/drivers/:id" element={<DriverDetailPage />} />

            <Route path="/dashboard/finance" element={<SpendOverviewPage />} />
            <Route path="/dashboard/finance/invoices" element={<InvoicesPage />} />
            <Route path="/dashboard/finance/invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="/dashboard/finance/payments" element={<PaymentsPage />} />
            <Route path="/dashboard/finance/billing" element={<BillingPage />} />
            <Route path="/dashboard/finance/fuel" element={<FuelCardsPage />} />
            <Route path="/dashboard/finance/savings" element={<SavingsPage />} />
            <Route path="/dashboard/finance/payroll" element={<PayrollPage />} />
            <Route path="/dashboard/finance/cashflow" element={<CashFlowPage />} />

            <Route path="/dashboard/analytics" element={<AnalyticsDashboard />} />
            <Route path="/dashboard/analytics/lanes" element={<LaneAnalyticsPage />} />
            <Route path="/dashboard/analytics/carriers" element={<CarrierScorecard />} />
            <Route path="/dashboard/analytics/reports" element={<ReportsPage />} />

            <Route path="/dashboard/insights" element={<Navigate to="/dashboard/insights/drivers" replace />} />
            <Route path="/dashboard/insights/drivers" element={<DriverPerformancePage />} />
            <Route path="/dashboard/insights/profitability" element={<ProfitabilityPage />} />
            <Route path="/dashboard/insights/fuel" element={<FuelIntelligencePage />} />
            <Route path="/dashboard/insights/forecast" element={<RevenueForecastPage />} />
            <Route path="/dashboard/insights/health" element={<HealthScorePage />} />

            <Route path="/dashboard/compliance" element={<ComplianceDashboard />} />
            <Route path="/dashboard/compliance/documents" element={<DocumentsPage />} />
            <Route path="/dashboard/compliance/safety" element={<SafetyPage />} />

            <Route path="/dashboard/settings" element={<SettingsLayout />}>
              <Route index element={<ProfilePage />} />
              <Route path="company" element={<CompanyPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="integrations" element={<IntegrationsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="billing" element={<BillingSettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
