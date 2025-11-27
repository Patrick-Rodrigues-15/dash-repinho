// app.js

const btnNew = document.getElementById("btnNew");
const modal = document.getElementById("modal");
const form = document.getElementById("formMachine");
const btnCancel = document.getElementById("btnCancel");
const tableBody = document.querySelector("#dataTable tbody");
const kpiTotal = document.getElementById("kpiTotal");
const kpiPending = document.getElementById("kpiPending");

document.querySelector(".logo").innerHTML = `<img src="https://lp.repinho.ind.br/content/themes/base/assets/imgs/repinho.png" alt="Repinho" style="width:38px;height:38px;border-radius:8px;">`;

let machines = JSON.parse(localStorage.getItem("machines")) || [];

const inputHours = form.querySelector('input[name="hours"]');
const inputNext = form.querySelector('input[name="nextChange"]');
inputNext.readOnly = true;

inputHours.addEventListener("input", () => {
  const hours = Number(inputHours.value) || 0;
  inputNext.value = hours > 0 ? hours + 500 : "";
});

btnNew.addEventListener("click", () => {
  form.reset();
  form.dataset.editing = "";
  modal.classList.remove("hidden");
});

btnCancel.addEventListener("click", () => {
  modal.classList.add("hidden");
});

function saveData() {
  localStorage.setItem("machines", JSON.stringify(machines));
  renderTable();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data.hours = Number(data.hours);
  data.nextChange = String(data.hours + 500);
  data.status = "OK";

  if (!form.dataset.editing) {
    machines.push(data);
  } else {
    const index = parseInt(form.dataset.editing, 10);
    machines[index] = { ...machines[index], ...data };
  }

  saveData();
  modal.classList.add("hidden");
});

function renderTable() {
  tableBody.innerHTML = "";
  let pending = 0;

  machines.forEach((m, i) => {
    const status = m.hours >= m.nextChange - 50 ? "Pendente" : "OK";
    if (status === "Pendente") pending++;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${m.name}</td>
      <td>${m.hours}</td>
      <td>${m.nextChange}</td>
      <td>
        <span style="color:${status === "OK" ? "var(--ok)" : "var(--warn)"};">
          ${status}
        </span>
      </td>
      <td>
        <button class="btn" onclick="editMachine(${i})">Editar</button>
        <button class="btn" onclick="deleteMachine(${i})">Excluir</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  kpiTotal.textContent = machines.length;
  kpiPending.textContent = pending;
}

window.editMachine = (index) => {
  const m = machines[index];
  modal.classList.remove("hidden");
  form.name.value = m.name;
  form.hours.value = m.hours;
  form.nextChange.value = m.nextChange;
  form.dataset.editing = index;
};

window.deleteMachine = (index) => {
  if (confirm("Deseja realmente excluir esta máquina?")) {
    machines.splice(index, 1);
    saveData();
  }
};

renderTable();
