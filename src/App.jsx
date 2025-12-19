import { useState } from "react";
import CreateTopic from "./pages/CreateTopic";
import KnowledgeCanvas from "./pages/KnowledgeCanvas";
import "./styles/header.css";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [mode, setMode] = useState("view");

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">
            Tanvi<span className="app-title-accent">Tech</span>
          </h1>

        </div>

        <nav className="header-actions">
          <span
            className={`nav-link ${mode === "view" ? "active" : ""}`}
            onClick={() => setMode("view")}
          >
            Library
          </span>

          <span
            className={`nav-link ${mode === "create" ? "active" : ""}`}
            onClick={() => setMode("create")}
          >
            Add Topic
          </span>
           <span
            className={`nav-link ${mode === "admin" ? "active" : ""}`}
            onClick={() => setMode("admin")}
          >
            Admin
          </span>
        </nav>
      </header>

      {mode === "view" && <KnowledgeCanvas />}
      {mode === "create" && <CreateTopic />}
      {mode === "admin" && <AdminPanel />}
    </>
  );
}
