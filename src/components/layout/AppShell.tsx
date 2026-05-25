import { Package, Users } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/users", label: "Users", icon: Users },
  { to: "/products", label: "Products", icon: Package },
] as const;

const API_META_URL = "https://smart-mock-api.onrender.com/__meta";

export const AppShell = memo(function AppShell() {
  const navLinkClassName = useCallback(
    ({ isActive }: { isActive: boolean }) =>
      cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60",
      ),
    [],
  );

  const navItems = useMemo(
    () =>
      NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} className={navLinkClassName} to={to}>
          <Icon aria-hidden="true" className="size-4" />
          {label}
        </NavLink>
      )),
    [navLinkClassName],
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
        <div className="border-b border-sidebar-border px-4 py-5">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Smart Mock
          </p>
          <p className="mt-1 text-sm font-medium text-sidebar-foreground">Admin Demo</p>
        </div>
        <nav aria-label="Main navigation" className="flex flex-1 flex-col gap-1 p-3">
          {navItems}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-card px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Smart Mock UI</h1>
              <p className="text-sm text-muted-foreground">
                Demo frontend for smart-mock-api
              </p>
            </div>
            <a
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              href={API_META_URL}
              rel="noreferrer"
              target="_blank"
            >
              API meta
            </a>
          </div>
          <nav
            aria-label="Mobile navigation"
            className="mt-4 flex gap-2 md:hidden"
          >
            {navItems}
          </nav>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
});
