import { useState } from "react";
import CreateTopic from "./pages/CreateTopic";
import KnowledgeCanvas from "./pages/KnowledgeCanvas";
import "./styles/header.css";

export default function App() {
  const [mode, setMode] = useState("view");

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <span className="app-title">Tanvi Tech.</span>
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
        </nav>
      </header>

      {mode === "view" ? <KnowledgeCanvas /> : <CreateTopic />}
    </>
  );
}
