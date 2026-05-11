import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "../Layouts/DashboardLayout";
import { HomePage } from "../Pages/HomePage/HomePage";
import { NotificationsPage } from "../Pages/HomePage/NotificationsPage";
import ErrorBoundary from "../Components/ErrorBoundary/ErrorBoundary";
import SupplierPages from "../Pages/SuppliersPages/SupplierPages";
import ProductAdd from "../Pages/ProductPages/ProductAdd";
import ProductManage from "../Pages/ProductPages/ProductManage";
import ManagePO from "../Pages/POPages/ManagePO";
import GRNManage from "../Pages/GRNPages/GRNManage";
import Payments from "../Pages/GENPaymentsPage/Payments";
import { InStockProductPages } from "../Pages/InStockProductPages/InStockProductPages";
import StockInPages from "../Pages/StockInPages/StockInPages";
import InventoryTracking from "../Pages/WarehouseBarcode/InventoryTracking";
import StockTransferImproved from "../Pages/WarehouseStocktransfer/StockTransferImproved";
import WarehouseListRefactored from "../Pages/WarehouseList/WarehouseListRefactored";
import ScrollToTop from "../Components/ScrollToTop/ScrollToTop";
import PosTerminalPage from "../Pages/PosTerminal/PosTerminalPage";
import DiscountsPages from "../Pages/DiscountsPages/DiscountsPages";
import SalesPaymentPage from "../Pages/SalesPaymentPage/SalesPaymentPage";
import SalesInvoice from "../Pages/SalesInvoice/SalesInvoice";
import SalesReturn from "../Pages/SalesReturns/SalesReturn";
import InventoryPages from "../Pages/InventoryPages/InventoryPages";
import StockDashboard from "../Pages/InventoryPages/StockDashboard/StockDashboard";
import LowStockAlerts from "../Pages/InventoryPages/LowStockAlerts/LowStockAlerts";
import AutoReorderSuggestions from "../Pages/InventoryPages/AutoReorderSuggestions/AutoReorderSuggestions";
import InventoryValuation from "../Pages/InventoryPages/InventoryValuation/InventoryValuation";
import SalesReports from "../Pages/InventoryPages/SalesReports/SalesReports";
import ProfitLossReports from "../Pages/InventoryPages/ProfitLossReports/ProfitLossReports";
import StockAnalysis from "../Pages/InventoryPages/StockAnalysis/StockAnalysis";
import LoginPage from "../Pages/LoginPage/LoginPage";
import ProfilePage from "../Pages/ProfilePage/ProfilePage";
import SettingsPage from "../Pages/SettingsPage/SettingsPage";
import ProtectedRoute from "./ProtectedRoute";

// Router config
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ErrorBoundary>
          <ScrollToTop />
          <DashboardLayout />
        </ErrorBoundary>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/overview" replace />
      },
      //dashboard
      {
        path: "/dashboard/overview",
        element: (
          <ErrorBoundary>
            <HomePage />
          </ErrorBoundary>
        )
      },
      {
        path: "/dashboard/notifications",
        element: (
          <ErrorBoundary>
            <NotificationsPage />
          </ErrorBoundary>
        )
      },
      //suppliers
      {
        path: "/suppliers/manage",
        element: <SupplierPages />
      },
      {
        path: "/suppliers/purchase-orders",
        element: <ManagePO />
      },
      {
        path: "/suppliers/grn",
        element: <GRNManage />
      },
      {
        path: "/suppliers/payments",
        element: <Payments />
      },
      //products
      {
        path: "/products/manage",
        element: <ProductManage />
      },
      {
        path: "/products/add",
        element: <ProductAdd />
      },
      //warehouse
      {
        path: "/warehouse/inhouse-products",
        element: <InStockProductPages />
      },
      {
        path: "/warehouse/stock-in",
        element: <StockInPages />
      },
      {
        path: "/warehouse/inventory-tracking",
        element: <InventoryTracking />
      },
      // Redirect old routes to new combined page
      {
        path: "/warehouse/barcode",
        element: <Navigate to="/warehouse/inventory-tracking" replace />
      },
      {
        path: "/warehouse/batch-tracking",
        element: <Navigate to="/warehouse/inventory-tracking" replace />
      },
      {
        path: "/warehouse/stock-transfer",
        element: <StockTransferImproved />
      },
      {
        path: "/warehouse/list",
        element: <WarehouseListRefactored />
      },
      //sales
      {
        path: "/sales/pos-terminal",
        element: <PosTerminalPage />
      },
      {
        path: "/sales/discounts",
        element: <DiscountsPages />
      },
      {
        path: "/sales/payments",
        element: <SalesPaymentPage />
      },
      {
        path: "/sales/invoice",
        element: <SalesInvoice />
      },
      {
        path: "/sales/returns",
        element: <SalesReturn />
      },
      //inventory
      {
        path: "/inventory",
        element: <InventoryPages />
      },
      {
        path: "/inventory/stock-dashboard",
        element: <StockDashboard />
      },
      {
        path: "/inventory/low-stock",
        element: <LowStockAlerts />
      },
      {
        path: "/inventory/reorder",
        element: <AutoReorderSuggestions />
      },
      {
        path: "/inventory/valuation",
        element: <InventoryValuation />
      },
      {
        path: "/inventory/sales-reports",
        element: <SalesReports />
      },
      {
        path: "/inventory/profit-loss",
        element: <ProfitLossReports />
      },
      {
        path: "/inventory/stock-analysis",
        element: <StockAnalysis />
      },
      //profile and settings
      {
        path: "/profile",
        element: <ProfilePage />
      },
      {
        path: "/settings",
        element: <SettingsPage />
      },
    ],
  },
]);

export default router;
