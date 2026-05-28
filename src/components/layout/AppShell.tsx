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

  const sidebarNavLinkClassName = useCallback(
    ({ isActive }: { isActive: boolean }) =>
      cn(
        "pressable flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground active:bg-sidebar-accent/80"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60 active:bg-sidebar-accent",
      ),
    [],
  );

  const mobileNavLinkClassName = useCallback(
    ({ isActive }: { isActive: boolean }) =>
      cn(
        "pressable flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground active:bg-sidebar-accent/80"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60 active:bg-sidebar-accent",
      ),
    [],
  );

  const sidebarNavItems = useMemo(
    () =>
      NAV_ITEMS.map(({ to, label, icon: Icon, ...item }) => (
        <NavLink
          key={to}
          className={sidebarNavLinkClassName}
          end={"end" in item ? item.end : undefined}
          to={to}
        >
          <Icon aria-hidden="true" className="size-4" />
          {label}
        </NavLink>
      )),
    [sidebarNavLinkClassName],
  );

  const mobileNavItems = useMemo(
    () =>
      NAV_ITEMS.map(({ to, label, icon: Icon, ...item }) => (
        <NavLink
          key={to}
          className={mobileNavLinkClassName}
          end={"end" in item ? item.end : undefined}
          to={to}
        >
          <Icon aria-hidden="true" className="size-3.5" />
          {label}
        </NavLink>
      )),
    [mobileNavLinkClassName],
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
        <div className="border-b border-sidebar-border px-4 py-5">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Smart Mock
          </p>
          <p className="mt-1 text-sm font-medium text-sidebar-foreground">
            Демо админки
          </p>
        </div>
        <nav aria-label="Основная навигация" className="flex flex-1 flex-col gap-1 p-3">
          {sidebarNavItems}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-card px-4 py-4 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight">Smart Mock UI</h1>
              <p className="text-sm text-muted-foreground">
                Демо-фронт для smart-mock-api
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <ApiHealthBadge apiBaseUrl={apiBaseUrl} />
              <ApiActivityToggle
                isOpen={isActivityOpen}
                onToggle={handleActivityToggle}
              />
              <ThemeToggle />
              <Link
                className="pressable-link hidden text-sm font-medium text-primary underline-offset-4 hover:underline md:inline"
                to="/meta"
              >
                Meta API
              </Link>
            </div>
          </div>
          <nav aria-label="Мобильная навигация" className="mt-4 md:hidden">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {mobileNavItems}
            </div>
          </nav>
          {isActivityOpen ? <ApiActivityPanel onClose={handleActivityClose} /> : null}
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
});
