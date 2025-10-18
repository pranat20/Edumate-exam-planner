import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => { load(); }, []);
  const load = () => api.get("tasks/").then(res => setTasks(res.data)).catch(console.error);

  const toggle = async (task) => {
    try {
      await api.put(`tasks/${task.id}/`, { ...task, completed: !task.completed });
      load();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {tasks.map(t => (
          <div key={t.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{t.topic}</div>
              <div className="text-sm text-gray-500">Study date: {t.study_date}</div>
            </div>
            <button onClick={()=>toggle(t)} className={`px-3 py-1 rounded ${t.completed ? "bg-green-500 text-white" : "bg-gray-200"}`}>
              {t.completed ? "Completed" : "Mark"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
