import { useState, useMemo } from "react";
import "../styles/bubbles.css";

export default function BubbleCanvas({ topics, activeSubjects }) {
  const [activeId, setActiveId] = useState(null);

  // filter topics by selected subjects
  const visibleTopics = useMemo(() => {
    if (!activeSubjects || activeSubjects.length === 0) return topics;
    return topics.filter(t => activeSubjects.includes(t.subject));
  }, [topics, activeSubjects]);

  const activeTopic = visibleTopics.find(t => t.id === activeId);

  return (
    <div
      className={`canvas ${activeId ? "dim" : ""}`}
      onClick={() => setActiveId(null)}
    >
      <div className="bubble-grid">
        {visibleTopics.map(topic => (
          <div
            key={topic.id}
            className={`bubble ${
              activeId === topic.id ? "open" : ""
            }`}
            onClick={e => {
              e.stopPropagation();
              setActiveId(topic.id);
            }}
          >
            <span className="bubble-title">{topic.title}</span>
          </div>
        ))}
      </div>

      {activeTopic && (
        <div className="bubble-overlay" onClick={() => setActiveId(null)}>
          <div
            className="bubble-content"
            onClick={e => e.stopPropagation()}
          >
            <h2>{activeTopic.title}</h2>

            <div
              className="html-content"
              dangerouslySetInnerHTML={{
                __html: activeTopic.content
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
