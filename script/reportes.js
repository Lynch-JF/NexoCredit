/* PrestaFácil — Admin App — Reportes */

(async () => {
  const session = pfRequireSession();
  if (!session) return;

  pfMountShell(session);

  const tbody = document.getElementById("pagos-tbody");
  const cardsEl = document.getElementById("stat-cards");
  const desdeInput = document.getElementById("f-desde");
  const hastaInput = document.getElementById("f-hasta");
  const cobradorSelect = document.getElementById("f-cobrador");

  const metodoLabel = { efectivo: "Efectivo", transferencia: "Transferencia" };

  function renderResumen(pagos) {
    const total = pagos.reduce((sum, p) => sum + p.monto, 0);
    const promedio = pagos.length ? total / pagos.length : 0;

    cardsEl.innerHTML = `
      <div class="stat-card">
        <p class="label">Total cobrado</p>
        <p class="value">${pfFormatCurrency(total)}</p>
      </div>
      <div class="stat-card">
        <p class="label">Cantidad de pagos</p>
        <p class="value">${pagos.length}</p>
      </div>
      <div class="stat-card">
        <p class="label">Promedio por pago</p>
        <p class="value">${pfFormatCurrency(Math.round(promedio))}</p>
      </div>
    `;
  }

  function renderTabla(pagos) {
    if (pagos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="skeleton">No hay pagos para este filtro.</td></tr>`;
      return;
    }

    tbody.innerHTML = pagos.map((p) => `
      <tr>
        <td>${p.fecha}</td>
        <td>${p.clienteNombre}</td>
        <td>${p.cobradorNombre}</td>
        <td><span class="metodo-tag">${metodoLabel[p.metodo] || p.metodo}</span></td>
        <td>${pfFormatCurrency(p.monto)}</td>
      </tr>
    `).join("");
  }

  async function cargarPagos() {
    tbody.innerHTML = `<tr><td colspan="5" class="skeleton">Cargando pagos…</td></tr>`;

    const pagos = await pfApi.getPagos({
      desde: desdeInput.value || null,
      hasta: hastaInput.value || null,
      cobradorId: cobradorSelect.value || null
    });

    renderResumen(pagos);
    renderTabla(pagos);
  }

  // Poblar el filtro de cobradores
  const cobradores = await pfApi.getCobradores();
  cobradorSelect.innerHTML = `<option value="">Todos</option>` + cobradores.map((c) =>
    `<option value="${c.id}">${c.nombre}</option>`
  ).join("");

  await cargarPagos();

  desdeInput.addEventListener("change", cargarPagos);
  hastaInput.addEventListener("change", cargarPagos);
  cobradorSelect.addEventListener("change", cargarPagos);

  document.getElementById("btn-limpiar-filtros").addEventListener("click", () => {
    desdeInput.value = "";
    hastaInput.value = "";
    cobradorSelect.value = "";
    cargarPagos();
  });
})();
