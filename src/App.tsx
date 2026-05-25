import { memo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { UsersPage } from "@/components/UsersPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { UserDetailPage } from "@/pages/UserDetailPage";

export const App = memo(function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<Navigate replace to="/users" />} index />
        <Route element={<UsersPage />} path="users" />
        <Route element={<UserDetailPage />} path="users/:id" />
        <Route element={<ProductsPage />} path="products" />
      </Route>
    </Routes>
  );
});
