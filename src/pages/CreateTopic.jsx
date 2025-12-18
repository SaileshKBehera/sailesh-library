import { useState } from "react";
import { supabase } from "../supabase";
import "../styles/form.css";
export default function CreateTopic() {
    const [form, setForm] = useState({
        subject: "",
        topic_key: "",
        title: "",
        content: ""
    });
    async function save() {
        await supabase.from("topics").insert([form]);
        alert("Saved");
        setForm({ subject: "", topic_key: "", title: "", content: "" });
    }
    return (
        <div className="form">
            <input placeholder="Subject" value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })} />
            <input placeholder="Topic Key" value={form.topic_key}
                onChange={e => setForm({ ...form, topic_key: e.target.value })} />
            <input placeholder="Title" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea placeholder="HTML content"
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
            />
            <button onClick={save}>Save</button>
        </div>
    );
}
