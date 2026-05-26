import { memo } from "react";
import { Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { UsersPage } from "@/components/UsersPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { MetaPage } from "@/pages/MetaPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProductCreatePage } from "@/pages/ProductCreatePage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { ProductEditPage } from "@/pages/ProductEditPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { UserCreatePage } from "@/pages/UserCreatePage";
import { UserDetailPage } from "@/pages/UserDetailPage";
import { UserEditPage } from "@/pages/UserEditPage";

export const App = memo(function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<DashboardPage />} index />
        <Route element={<UsersPage />} path="users" />
        <Route element={<UserCreatePage />} path="users/new" />
        <Route element={<UserEditPage />} path="users/:id/edit" />
        <Route element={<UserDetailPage />} path="users/:id" />
        <Route element={<ProductsPage />} path="products" />
        <Route element={<ProductCreatePage />} path="products/new" />
        <Route element={<ProductEditPage />} path="products/:id/edit" />
        <Route element={<ProductDetailPage />} path="products/:id" />
        <Route element={<MetaPage />} path="meta" />
        <Route element={<NotFoundPage />} path="*" />
      </Route>
    </Routes>
  );
});
