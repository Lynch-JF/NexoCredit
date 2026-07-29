/* PrestaFácil — Admin App — Clientes */

(async () => {
  const session = pfRequireSession();
  if (!session) return;

  pfMountShell(session);

  let clientes = [];

  const tbody = document.getElementById("clientes-tbody");
  const searchInput = document.getElementById("search-input");

  function estadoLabel(c) {
    if (c.estado === "mora") return `En mora · ${c.diasMora} días`;
    return "Al día";
  }

  function renderRows(lista) {
    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="skeleton">No se encontraron clientes.</td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map((c) => `
      <tr data-id="${c.id}">
        <td>
          <div style="font-weight:500;color:var(--ink)">${c.nombre}</div>
          <div style="font-size:12px;color:var(--muted)">${c.cedula}</div>
        </td>
        <td>${c.zona}</td>
        <td>${pfFormatCurrency(c.saldoPendiente)}</td>
        <td>${pfFormatCurrency(c.cuota)}</td>
        <td><span class="badge ${c.estado}">${estadoLabel(c)}</span></td>
      </tr>
    `).join("");

    tbody.querySelectorAll("tr[data-id]").forEach((row) => {
      row.addEventListener("click", () => {
        window.location.href = `cliente-detalle.html?id=${row.dataset.id}`;
      });
    });
  }

  function applyFilter() {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      renderRows(clientes);
      return;
    }
    renderRows(clientes.filter((c) =>
      c.nombre.toLowerCase().includes(q) || c.cedula.includes(q)
    ));
  }

  clientes = await pfApi.getClientes();
  renderRows(clientes);

  searchInput.addEventListener("input", applyFilter);

  // ---- Modal: nuevo cliente ----
  const modal = document.getElementById("modal-nuevo-cliente");
  const form = document.getElementById("form-nuevo-cliente");

  document.getElementById("btn-nuevo-cliente").addEventListener("click", () => {
    modal.classList.add("open");
  });

  document.getElementById("btn-cancelar-nuevo").addEventListener("click", () => {
    modal.classList.remove("open");
    form.reset();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
      form.reset();
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevo = await pfApi.crearCliente({
      nombre: document.getElementById("nc-nombre").value.trim(),
      cedula: document.getElementById("nc-cedula").value.trim(),
      telefono: document.getElementById("nc-telefono").value.trim(),
      zona: document.getElementById("nc-zona").value.trim(),
      cuota: 0
    });

    clientes = [nuevo, ...clientes];
    applyFilter();

    modal.classList.remove("open");
    form.reset();
  });
})();
