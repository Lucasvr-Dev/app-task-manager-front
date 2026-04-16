const API = "https://app-pet-back.onrender.com/api/tasks";

let editId = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  const list = document.getElementById("list");

  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const status = document.getElementById("status");
  const priority = document.getElementById("priority");
  const dueDate = document.getElementById("dueDate");

  async function load() {
    const res = await fetch(API);
    const data = await res.json();
    const safe = Array.isArray(data) ? data : [];

    list.innerHTML = safe.map(t => `
      <div>
        <h3>${t.title}</h3>
        <p>${t.description || ''}</p>
        <p>${t.status}</p>
        <p>${t.priority}</p>

        <button onclick="editTask('${t._id}')">Editar</button>
        <button onclick="deleteTask('${t._id}')">Excluir</button>
      </div>
    `).join('');
  }

  form.onsubmit = async (e) => {
    e.preventDefault();

    const data = {
      title: title.value,
      description: description.value,
      status: status.value,
      priority: priority.value,
      dueDate: dueDate.value || null
    };

    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    editId = null;
    form.reset();

    status.value = "pendente";
    priority.value = "media";

    load();
  };

  window.editTask = async (id) => {
    const res = await fetch(`${API}/${id}`);
    const t = await res.json();

    editId = id;

    title.value = t.title;
    description.value = t.description;
    status.value = t.status;
    priority.value = t.priority;

    dueDate.value = t.dueDate
      ? new Date(t.dueDate).toISOString().slice(0, 16)
      : "";
  };

  window.deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    load();
  };

  load();
});