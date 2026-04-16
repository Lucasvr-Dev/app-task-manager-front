const API = 'https://app-pet-back.onrender.com/api/tasks';

const form = document.getElementById('task-form');
const list = document.getElementById('list');

let editId = null;

async function load() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    if (!data.length) {
      list.innerHTML = '<p>Nenhuma tarefa cadastrada.</p>';
      return;
    }

    list.innerHTML = data.map(t => `
      <div class="task">
        <div class="task-header">
          <h3>${t.title}</h3>
          <span class="status ${t.status}">${t.status}</span>
        </div>

        <p>${t.description || 'Sem descrição'}</p>

        <div class="task-actions">
          <button onclick="edit('${t._id}')">Editar</button>
          <button onclick="del('${t._id}')">Excluir</button>
        </div>
      </div>
    `).join('');

  } catch {
    list.innerHTML = '<p>Erro ao carregar tarefas.</p>';
  }
}

form.onsubmit = async (e) => {
  e.preventDefault();

  const data = {
    title: title.value,
    description: description.value,
    status: status.value
  };

  const method = editId ? 'PUT' : 'POST';
  const url = editId ? `${API}/${editId}` : API;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  form.reset();
  editId = null;
  load();
};

window.edit = async (id) => {
  const res = await fetch(`${API}/${id}`);
  const t = await res.json();

  editId = t._id;
  title.value = t.title;
  description.value = t.description;
  status.value = t.status;
};

window.del = async (id) => {
  if (!confirm('Deseja excluir esta tarefa?')) return;

  await fetch(`${API}/${id}`, { method: 'DELETE' });
  load();
};

load();