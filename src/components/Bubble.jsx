export default function Bubble({ topic, active, setActive }) {
    const isOpen = active === topic.id;


    return (
        <div
            className={`bubble ${isOpen ? "open" : ""}`}
            onClick={e => {
                e.stopPropagation();
                setActive(isOpen ? null : topic.id);
            }}
        >
            <h4>{topic.title}</h4>
            {isOpen && (
                <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: topic.content.replace(/\n/g, "<br />") }}
                />
            )}
        </div>
    );
}