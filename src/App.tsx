import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import { PublicLayout } from "./components/PublicLayout";
import { AdminLayout } from "./components/AdminLayout";

// Public Pages
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { OtherProductsPage } from "./pages/OtherProductsPage";
import { TradeEnquiriesPage } from "./pages/TradeEnquiriesPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsPage } from "./pages/TermsPage";

// Admin Pages
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminProductEditorPage } from "./pages/admin/AdminProductEditorPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminMediaPage } from "./pages/admin/AdminMediaPage";
import { AdminEnquiriesPage } from "./pages/admin/AdminEnquiriesPage";
import { AdminEnquiryDetailPage } from "./pages/admin/AdminEnquiryDetailPage";
import { AdminPagesPage } from "./pages/admin/AdminPagesPage";
import { AdminPageEditorPage } from "./pages/admin/AdminPageEditorPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminAuditLogPage } from "./pages/admin/AdminAuditLogPage";

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route
              path="products/other-products"
              element={<OtherProductsPage />}
            />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="trade-enquiries" element={<TradeEnquiriesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Console */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductEditorPage />} />
            <Route
              path="products/:id/edit"
              element={<AdminProductEditorPage />}
            />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="media" element={<AdminMediaPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
            <Route path="enquiries/:id" element={<AdminEnquiryDetailPage />} />
            <Route path="pages" element={<AdminPagesPage />} />
            <Route path="pages/:id/edit" element={<AdminPageEditorPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="audit-log" element={<AdminAuditLogPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
