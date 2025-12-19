import { useMemo, useState } from "react";
import "../styles/subjectTags.css";

export default function SubjectTags({ topics, onChange }) {
  const [selected, setSelected] = useState([]);

  // Get unique subjects from topics
  const subjects = useMemo(() => {
    const set = new Set();
    topics.forEach(t => {
      if (t.subject) set.add(t.subject);
    });
    return Array.from(set);
  }, [topics]);

  function toggleSubject(subject) {
    setSelected(prev => {
      const updated = prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject];

      onChange(updated);
      return updated;
    });
  }

  if (subjects.length === 0) return null;

  return (
    <div className="subject-tags">
      {subjects.map(subject => {
        const active = selected.includes(subject);

        return (
          <button
            key={subject}
            className={`subject-pill ${active ? "active" : ""}`}
            onClick={() => toggleSubject(subject)}
          >
            {subject}
          </button>
        );
      })}
    </div>
  );
}
