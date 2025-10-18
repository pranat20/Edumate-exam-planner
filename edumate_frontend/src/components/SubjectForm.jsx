// SubjectForm.jsx
import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function SubjectForm() {
  const [form, setForm] = useState({
    name: "",
    exam_date: "",
    total_topics: 0,
    category: "college",
    syllabus_file: null,
  });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("exam_date", form.exam_date);
      fd.append("total_topics", form.total_topics);
      fd.append("category", form.category);
      if (form.syllabus_file) fd.append("syllabus_file", form.syllabus_file);

      const res = await api.post("subjects/", fd);
      alert("Subject created");
      nav("/subjects");
    } catch (err) {
      console.error(err);
      alert("Error creating subject");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto p-4 space-y-3">
      <input className="input" placeholder="Subject name" value={form.name}
        onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input className="input" type="date" value={form.exam_date}
        onChange={(e)=>setForm({...form,exam_date:e.target.value})}/>
      <input className="input" type="number" placeholder="Total topics" value={form.total_topics}
        onChange={(e)=>setForm({...form,total_topics:e.target.value})}/>
      <select className="input" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}>
        <option value="school">School</option>
        <option value="college">College</option>
        <option value="engineering">Engineering</option>
        <option value="competitive">Competitive</option>
      </select>
      <input type="file" onChange={(e)=>setForm({...form,syllabus_file:e.target.files[0]})}/>
      <button className="btn-accent">Create Subject</button>
    </form>
  );
}
