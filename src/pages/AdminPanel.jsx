import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/form.css";

export default function AdminPanel() {
  const [session, setSession] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [newSubject, setNewSubject] = useState("");

  const [editingTopic, setEditingTopic] = useState(null);
  const [editForm, setEditForm] = useState({
    subject: "",
    title: "",
    content: ""
  });

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!session) return;

    supabase
      .from("subjects")
      .select("*")
      .order("name")
      .then(({ data }) => setSubjects(data || []));

    supabase
      .from("topics")
      .select("*")
      .order("title")
      .then(({ data }) => setTopics(data || []));
  }, [session]);

  /* ---------------- SUBJECT ---------------- */
  async function addSubject() {
    if (!newSubject.trim()) return;

    const { error } = await supabase
      .from("subjects")
      .insert([{ name: newSubject.trim() }]);

    if (error) {
      alert("Failed to add subject");
      console.error(error);
      return;
    }

    setSubjects(prev => [...prev, { name: newSubject.trim() }]);
    setNewSubject("");
  }

  /* ---------------- TOPIC ACTIONS ---------------- */
  function startEdit(topic) {
    setEditingTopic(topic.id);
    setEditForm({
      subject: topic.subject,
      title: topic.title,
      content: topic.content
    });
  }

  async function saveEdit() {
    const { error } = await supabase
      .from("topics")
      .update(editForm)
      .eq("id", editingTopic);

    if (error) {
      alert("Update failed");
      console.error(error);
      return;
    }

    setTopics(prev =>
      prev.map(t =>
        t.id === editingTopic ? { ...t, ...editForm } : t
      )
    );

    setEditingTopic(null);
  }

  async function deleteTopic(id) {
    if (!window.confirm("Delete this topic?")) return;

    const { error } = await supabase
      .from("topics")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed");
      console.error(error);
      return;
    }

    setTopics(prev => prev.filter(t => t.id !== id));
  }

  /* ---------------- GUARD ---------------- */
  if (!session) {
    return (
      <div className="form">
        <h3>Admin access required</h3>
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "github" })
          }
        >
          Login with GitHub
        </button>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="form">
      <h2>Admin Panel</h2>

      {/* ADD SUBJECT */}
      <h3>Add Subject</h3>
      <input
        placeholder="New subject"
        value={newSubject}
        onChange={e => setNewSubject(e.target.value)}
      />
      <button onClick={addSubject}>Add Subject</button>

      <hr />

      {/* MANAGE TOPICS */}
      <h3>Manage Topics</h3>

      {topics.map(t => (
        <div key={t.id} style={{ marginBottom: 20 }}>
          {editingTopic === t.id ? (
            <>
              <select
                value={editForm.subject}
                onChange={e =>
                  setEditForm({ ...editForm, subject: e.target.value })
                }
              >
                {subjects.map(s => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <input
                value={editForm.title}
                onChange={e =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Title"
              />

              <textarea
                value={editForm.content}
                onChange={e =>
                  setEditForm({ ...editForm, content: e.target.value })
                }
                placeholder="Content"
              />

              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingTopic(null)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <strong>{t.title}</strong>
              <button
                style={{ marginLeft: 12 }}
                onClick={() => startEdit(t)}
              >
                Edit
              </button>
              <button
                style={{ marginLeft: 8 }}
                onClick={() => deleteTopic(t.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
