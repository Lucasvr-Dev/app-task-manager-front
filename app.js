const API = 'https://app-pet-back.onrender.com/api';


const petForm = document.getElementById('pet-form');
const petSelect = document.getElementById('pet-select');

const entryForm = document.getElementById('entry-form');


async function loadPets() {
  try {
    const res = await fetch(`${API}/pets`);
    const pets = await res.json();

    petSelect.innerHTML = pets.map(p =>
      `<option value="${p._id}">${p.name}</option>`
    ).join('');

  } catch (err) {
    alert('Erro ao carregar pets');
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

    alert('Pet criado com sucesso ');

    petForm.reset();
    loadPets();

  } catch {
    alert('Erro ao criar pet');
  }
});


entryForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    happenedAt: document.getElementById('happenedAt').value,
    petId: petSelect.value
  };

  try {
    await fetch(`${API}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    alert('Registro salvo com sucesso 📘');

    entryForm.reset();

  } catch {
    alert('Erro ao salvar registro');
  }
});


loadPets();