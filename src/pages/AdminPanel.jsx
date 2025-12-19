import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/form.css";

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [newSubject, setNewSubject] = useState("");

  /* -------- Auth -------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  /* -------- Data -------- */
  useEffect(() => {
    if (!session) return;

    supabase.from("subjects").select("*").then(({ data }) => setSubjects(data || []));
    supabase.from("topics").select("*").then(({ data }) => setTopics(data || []));
  }, [session]);

  /* -------- Actions -------- */
  async function addSubject() {
    if (!newSubject.trim()) return;

    const { error } = await supabase
      .from("subjects")
      .insert([{ name: newSubject.trim() }]);

    if (!error) {
      setSubjects(prev => [...prev, { name: newSubject }]);
      setNewSubject("");
    }
  }

  async function deleteTopic(id) {
    if (!window.confirm("Delete this topic?")) return;

    const { error } = await supabase
      .from("topics")
      .delete()
      .eq("id", id);

    if (!error) {
      setTopics(prev => prev.filter(t => t.id !== id));
    }
  }

  /* -------- Guard -------- */
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

  /* -------- UI -------- */
  return (
    <div className="form">
      <h3>Add Subject</h3>

      <input
        placeholder="New subject"
        value={newSubject}
        onChange={e => setNewSubject(e.target.value)}
      />
      <button onClick={addSubject}>Add Subject</button>

      <hr />

      <h3>Delete Topics</h3>

      {topics.map(t => (
        <div key={t.id} style={{ marginBottom: 8 }}>
          {t.title}
          <button
            style={{ marginLeft: 12 }}
            onClick={() => deleteTopic(t.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
