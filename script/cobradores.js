/* PrestaFácil — Admin App — Cobradores */

(async () => {
  const session = pfRequireSession();
  if (!session) return;

  pfMountShell(session);

  let cobradores = [];

  const tbody = document.getElementById("cobradores-tbody");
  const searchInput = document.getElementById("search-input");

  function estadoLabel(c) {
    return c.estado === "activo" ? "Activo" : "Inactivo";
  }

  function renderRows(lista) {
    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="skeleton">No se encontraron cobradores.</td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map((c) => `
      <tr>
        <td>
          <div style="font-weight:500;color:var(--ink)">${c.nombre}</div>
          <div style="font-size:12px;color:var(--muted)">${c.telefono}</div>
        </td>
        <td>${c.zona}</td>
        <td>${c.clientes}</td>
        <td>${pfFormatCurrency(c.cobradoHoy)}</td>
        <td><span class="badge ${c.estado}">${estadoLabel(c)}</span></td>
      </tr>
    `).join("");
  }

  function applyFilter() {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      renderRows(cobradores);
      return;
    }
    renderRows(cobradores.filter((c) =>
      c.nombre.toLowerCase().includes(q) || c.zona.toLowerCase().includes(q)
    ));
  }

  cobradores = await pfApi.getCobradores();
  renderRows(cobradores);

  searchInput.addEventListener("input", applyFilter);

  // ---- Modal: nuevo cobrador ----
  const modal = document.getElementById("modal-nuevo-cobrador");
  const form = document.getElementById("form-nuevo-cobrador");

  document.getElementById("btn-nuevo-cobrador").addEventListener("click", () => {
    modal.classList.add("open");
  });

  document.getElementById("btn-cancelar-nuevo-cobrador").addEventListener("click", () => {
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

    const nuevo = await pfApi.crearCobrador({
      nombre: document.getElementById("ncb-nombre").value.trim(),
      telefono: document.getElementById("ncb-telefono").value.trim(),
      zona: document.getElementById("ncb-zona").value.trim()
    });

    cobradores = [nuevo, ...cobradores];
    applyFilter();

    modal.classList.remove("open");
    form.reset();
  });
})();
