import { memo } from "react";

import { UsersPage } from "./components/UsersPage";

export const App = memo(function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Smart Mock UI</h1>
        <p>Демо-фронт для smart-mock-api</p>
      </header>
      <main>
        <UsersPage />
      </main>
    </div>
  );
});
