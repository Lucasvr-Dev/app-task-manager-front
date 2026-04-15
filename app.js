const API = 'https://app-pet-back.onrender.com/api';


const petForm = document.getElementById('pet-form');
const petSelect = document.getElementById('pet-select');

const entryForm = document.getElementById('entry-form');
const entriesList = document.getElementById('entries-list');


let currentEntryId = null;



async function loadPets() {
  try {
    const res = await fetch(`${API}/pets`);

    if (!res.ok) throw new Error();

    const pets = await res.json();

    if (!pets.length) {
      petSelect.innerHTML = `<option disabled selected>Nenhum pet cadastrado</option>`;
      return;
    }

    petSelect.innerHTML = pets.map(p =>
      `<option value="${p._id}">${p.name}</option>`
    ).join('');

  } catch (err) {
    console.error(err);
    petSelect.innerHTML = `<option disabled selected>Erro ao carregar pets</option>`;
  }
}



petForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('pet-name').value,
    type: document.getElementById('pet-type').value,
    age: document.getElementById('pet-age').value
  };

  try {
    await fetch(`${API}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    alert('Pet criado com sucesso 🐶');

    petForm.reset();
    loadPets();

  } catch {
    alert('Erro ao criar pet');
  }
});



async function loadEntries() {
  try {
    const res = await fetch(`${API}/entries`);

    if (!res.ok) throw new Error();

    const entries = await res.json();

    if (!entries.length) {
      entriesList.innerHTML = '<p>Nenhum registro encontrado.</p>';
      return;
    }

    entriesList.innerHTML = entries.map(e => `
      <div class="entry-item mb-3 p-2 border rounded">
        <h5>${e.title}</h5>
        <p>${new Date(e.happenedAt).toLocaleString()}</p>
        <p>${e.description}</p>
        <strong>Pet: ${e.petId?.name || 'Sem pet'}</strong>

        <div class="mt-2 d-flex gap-2">
          <button class="btn btn-warning btn-sm" onclick="editEntry('${e._id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteEntry('${e._id}')">Excluir</button>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error(err);
    entriesList.innerHTML = '<p>Erro ao carregar registros.</p>';
  }
}



entryForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    happenedAt: document.getElementById('happenedAt').value,
    petId: petSelect.value
  };

  try {
    const method = currentEntryId ? 'PUT' : 'POST';
    const url = currentEntryId
      ? `${API}/entries/${currentEntryId}`
      : `${API}/entries`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    alert(currentEntryId ? 'Registro atualizado ✏️' : 'Registro criado 📘');

    entryForm.reset();
    currentEntryId = null;

    loadEntries();

  } catch {
    alert('Erro ao salvar registro');
  }
});



window.editEntry = async (id) => {
  try {
    const res = await fetch(`${API}/entries/${id}`);
    const e = await res.json();

    currentEntryId = e._id;

    document.getElementById('title').value = e.title;
    document.getElementById('description').value = e.description;
    document.getElementById('happenedAt').value =
      new Date(e.happenedAt).toISOString().slice(0, 16);

    petSelect.value = e.petId?._id;

  } catch {
    alert('Erro ao carregar registro');
  }
};



window.deleteEntry = async (id) => {
  if (!confirm('Deseja excluir este registro?')) return;

  try {
    await fetch(`${API}/entries/${id}`, { method: 'DELETE' });

    alert('Registro excluído 🗑️');
    loadEntries();

  } catch {
    alert('Erro ao excluir registro');
  }
};



loadPets();
loadEntries();