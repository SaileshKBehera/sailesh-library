import { useState } from "react";
import CreateTopic from "./pages/CreateTopic";
import KnowledgeCanvas from "./pages/KnowledgeCanvas";
export default function App() {
  const [mode, setMode] = useState("view");
  return (
    <>
    <header className="app-header">
  <div className="header-left">
    <h1 className="app-title">Knowledge Library</h1>
    <p className="app-subtitle">
      Curated concepts, visually explored
    </p>
  </div>

  <div className="header-actions">
    <button className="header-btn primary" onClick={() => setMode("view")}>Library</button>
    <button className="header-btn" onClick={() => setMode("create")}>Add Topic</button>
  </div>
</header>
      
      {mode === "view" ? <KnowledgeCanvas /> : <CreateTopic />}
    </>

  );
}
