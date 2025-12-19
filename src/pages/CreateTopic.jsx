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

  useEffect(() => {
    // Get existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function save() {
    if (!session) {
      alert("Please login with GitHub to add a topic");
      return;
    }

    const { error } = await supabase.from("topics").insert([form]);

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

  // If not logged in → show login
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

  // Logged in → show form
  return (
    <div className="form">
      <input
        placeholder="Subject"
        value={form.subject}
        onChange={e =>
          setForm({ ...form, subject: e.target.value })
        }
      />

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
