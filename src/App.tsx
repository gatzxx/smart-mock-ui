import { memo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { UsersPage } from "@/components/UsersPage";
import { ProductsPlaceholderPage } from "@/pages/ProductsPlaceholderPage";
import { UserDetailPlaceholderPage } from "@/pages/UserDetailPlaceholderPage";

export const App = memo(function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<Navigate replace to="/users" />} index />
        <Route element={<UsersPage />} path="users" />
        <Route element={<UserDetailPlaceholderPage />} path="users/:id" />
        <Route element={<ProductsPlaceholderPage />} path="products" />
      </Route>
    </Routes>
  );
});
