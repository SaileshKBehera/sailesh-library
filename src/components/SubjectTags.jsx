export default function SubjectTags({ topics, onChange }) {
    const subjects = [...new Set(topics.map(t => t.subject))];

    function toggle(subject) {
        onChange(prev =>
            prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        );
    }

    return (
        <div className="subject-bar">
            {subjects.map(s => (
                <span key={s} className="tag" onClick={() => toggle(s)}>
                    {s}
                </span>
            ))}
        </div>
    );
}
