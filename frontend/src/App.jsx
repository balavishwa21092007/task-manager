import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";
import Statistics from "./components/Statistics";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;

    await api.post("/tasks", {
      title,
    });

    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await api.put(`/tasks/${task.id}`, {
      title: task.title,
      completed: !task.completed,
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async (task) => {
    if (!editTitle.trim()) return;

    await api.put(`/tasks/${task.id}`, {
      title: editTitle,
      completed: task.completed,
    });

    setEditingId(null);
    setEditTitle("");
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>📋 Task Manager</h1>
      
      <Statistics tasks={tasks} />

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter new task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button onClick={addTask}>Add Task</button>
      </div>

      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "6px",
        }}
      />

      {filteredTasks.map((task) => (
        <div className="task" key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task)}
          />

          {editingId === task.id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <button className="save" onClick={() => saveEdit(task)}>
                Save
              </button>

              <button
                className="cancel"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span
                style={{
                  flex: 1,
                  textDecoration: task.completed
                    ? "line-through"
                    : "none",
                }}
              >
                {task.title}
              </span>

              <button
                className="edit"
                onClick={() => startEdit(task)}
              >
                Edit
              </button>

              <button
                className="delete"
                onClick={() => deleteTask(task.id)}
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

export default App;