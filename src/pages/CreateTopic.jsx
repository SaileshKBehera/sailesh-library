import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/form.css";

export default function CreateTopic() {
  const [form, setForm] = useState({
    subject: "",
    topic_key: "",
    title: "",
    content: ""
  });

  const [session, setSession] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ---------------- FETCH SUBJECTS ---------------- */
  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase
        .from("subjects")
        .select("name")
        .order("name");

      if (error) {
        console.error("Error fetching subjects", error);
      } else {
        setSubjects(data);
      }

      setLoadingSubjects(false);
    }

    fetchSubjects();
  }, []);

  /* ---------------- SAVE ---------------- */
  async function save() {
    if (!session) {
      alert("Please login with GitHub to add a topic");
      return;
    }

    if (!form.subject) {
      alert("Please select a subject");
      return;
    }

    const { error } = await supabase.from("topics").insert([
      {
        ...form,
        created_by: session.user.id // optional but recommended
      }
    ]);

    if (error) {
      alert("You are not authorized to add topics");
      console.error(error);
      return;
    }

    alert("Saved");

    setForm({
      subject: "",
      topic_key: "",
      title: "",
      content: ""
    });
  }

  /* ---------------- LOGIN UI ---------------- */
  if (!session) {
    return (
      <div className="form">
        <p>Login required to add a topic</p>
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

  /* ---------------- FORM ---------------- */
  return (
    <div className="form">
      {/* SUBJECT DROPDOWN */}
      <select
        value={form.subject}
        onChange={e =>
          setForm({ ...form, subject: e.target.value })
        }
        disabled={loadingSubjects}
      >
        <option value="">
          {loadingSubjects ? "Loading subjects..." : "Select Subject"}
        </option>

        {subjects.map(s => (
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Topic Key"
        value={form.topic_key}
        onChange={e =>
          setForm({ ...form, topic_key: e.target.value })
        }
      />

      <input
        placeholder="Title"
        value={form.title}
        onChange={e =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        placeholder="HTML content"
        value={form.content}
        onChange={e =>
          setForm({ ...form, content: e.target.value })
        }
      />

      <button onClick={save}>Save</button>
    </div>
  );
}
