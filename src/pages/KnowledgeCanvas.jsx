import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import SubjectTags from "../components/SubjectTags";
import BubbleCanvas from "../components/BubbleCanvas";


export default function KnowledgeCanvas() {
    const [topics, setTopics] = useState([]);
    const [subjects, setSubjects] = useState([]);


    useEffect(() => {
        supabase.from("topics").select("*").then(({ data }) => {
            setTopics(data || []);
        });
    }, []);


    const filtered = subjects.length
        ? topics.filter(t => subjects.includes(t.subject))
        : topics;


    return (
        <>
            <SubjectTags topics={topics} onChange={setSubjects} />
            <BubbleCanvas topics={filtered} />
        </>
    );
}