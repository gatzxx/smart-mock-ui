import { FileJson, LayoutDashboard, Package, Users } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import { ApiActivityPanel } from "@/components/ApiActivityPanel";
import { ApiActivityToggle } from "@/components/ApiActivityToggle";
import { ApiHealthBadge } from "@/components/ApiHealthBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Обзор", icon: LayoutDashboard, end: true },
  { to: "/users", label: "Пользователи", icon: Users },
  { to: "/products", label: "Товары", icon: Package },
  { to: "/meta", label: "Meta API", icon: FileJson },
] as const;

export const AppShell = memo(function AppShell() {
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const apiBaseUrl = useApiBaseUrl();

  const handleActivityToggle = useCallback(() => {
    setIsActivityOpen((currentIsOpen) => !currentIsOpen);
  }, []);

  const handleActivityClose = useCallback(() => {
    setIsActivityOpen(false);
  }, []);

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
      NAV_ITEMS.map(({ to, label, icon: Icon, ...item }) => (
        <NavLink
          key={to}
          className={navLinkClassName}
          end={"end" in item ? item.end : undefined}
          to={to}
        >
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
          <p className="mt-1 text-sm font-medium text-sidebar-foreground">Демо админки</p>
        </div>
        <nav aria-label="Основная навигация" className="flex flex-1 flex-col gap-1 p-3">
          {navItems}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-card px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Smart Mock UI</h1>
              <p className="text-sm text-muted-foreground">
                Демо-фронт для smart-mock-api
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ApiHealthBadge apiBaseUrl={apiBaseUrl} />
              <ApiActivityToggle isOpen={isActivityOpen} onToggle={handleActivityToggle} />
              <ThemeToggle />
              <Link
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                to="/meta"
              >
                Meta API
              </Link>
            </div>
          </div>
          <nav
            aria-label="Мобильная навигация"
            className="mt-4 flex gap-2 md:hidden"
          >
            {navItems}
          </nav>
          {isActivityOpen ? <ApiActivityPanel onClose={handleActivityClose} /> : null}
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
});
