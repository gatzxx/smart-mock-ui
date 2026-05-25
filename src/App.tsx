import { memo } from "react";
import { Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { UsersPage } from "@/components/UsersPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { MetaPage } from "@/pages/MetaPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { UserDetailPage } from "@/pages/UserDetailPage";

export const App = memo(function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<DashboardPage />} index />
        <Route element={<UsersPage />} path="users" />
        <Route element={<UserDetailPage />} path="users/:id" />
        <Route element={<ProductsPage />} path="products" />
        <Route element={<MetaPage />} path="meta" />
        <Route element={<NotFoundPage />} path="*" />
      </Route>
    </Routes>
  );
});
