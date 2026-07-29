// contabilidad.js
// NOTA: no tengo el contenido real de mock-data.js / gm-api.js, así que esta
// versión trabaja con datos de ejemplo en memoria (array `movimientos`) para
// que la página funcione de inmediato. Cuando me pases esos dos archivos,
// lo cambio a pfApi.getMovimientosContables() / pfApi.crearMovimiento()
// igual que hacen dashboard.js y reportes.js con pfApi.

(function () {
  let movimientos = [
    { id: "m1", fecha: "2026-07-29", tipo: "ingreso", categoria: "intereses", descripcion: "Intereses cobrados semana 30", monto: 5300 },
    { id: "m2", fecha: "2026-07-28", tipo: "gasto", categoria: "nomina", descripcion: "Comisión Carlos Peña", monto: 1200 },
    { id: "m3", fecha: "2026-07-27", tipo: "ingreso", categoria: "mora", descripcion: "Recargo por mora — Julio Ramírez", monto: 150 },
    { id: "m4", fecha: "2026-07-26", tipo: "gasto", categoria: "operativo", descripcion: "Combustible ruta zona norte", monto: 800 },
  ];

  const categoriaLabel = {
    intereses: "Intereses de préstamos",
    mora: "Recargos por mora",
    "otro-ingreso": "Otro ingreso",
    nomina: "Nómina / comisiones",
    operativo: "Gastos operativos",
    "otro-gasto": "Otro gasto",
  };

  const tbody = document.getElementById("movimientos-tbody");
  const statCards = document.getElementById("stat-cards");
  const modal = document.getElementById("modal-movimiento");
  const form = document.getElementById("form-movimiento");
  const modalTitulo = document.getElementById("modal-movimiento-titulo");

  function formatCurrency(n) {
    return "$" + Number(n).toLocaleString("es-DO", { minimumFractionDigits: 0 });
  }

  function currentFilters() {
    return {
      desde: document.getElementById("f-desde").value,
      hasta: document.getElementById("f-hasta").value,
      tipo: document.getElementById("f-tipo").value,
      q: document.getElementById("search-input").value.trim().toLowerCase(),
    };
  }

  function filtered() {
    const f = currentFilters();
    return movimientos.filter((m) => {
      if (f.desde && m.fecha < f.desde) return false;
      if (f.hasta && m.fecha > f.hasta) return false;
      if (f.tipo && m.tipo !== f.tipo) return false;
      if (f.q && !(m.descripcion.toLowerCase().includes(f.q) || categoriaLabel[m.categoria].toLowerCase().includes(f.q))) return false;
      return true;
    });
  }

  function renderStats(rows) {
    const ingresos = rows.filter((m) => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
    const gastos = rows.filter((m) => m.tipo === "gasto").reduce((s, m) => s + m.monto, 0);
    const balance = ingresos - gastos;
    statCards.innerHTML = `
      <div class="stat-card">
        <p class="label">Ganancias por intereses (período)</p>
        <p class="value success">${formatCurrency(rows.filter(m => m.categoria === "intereses").reduce((s, m) => s + m.monto, 0))}</p>
      </div>
      <div class="stat-card">
        <p class="label">Gastos operativos (período)</p>
        <p class="value danger">${formatCurrency(gastos)}</p>
      </div>
      <div class="stat-card">
        <p class="label">Balance neto</p>
        <p class="value ${balance >= 0 ? "success" : "danger"}">${formatCurrency(balance)}</p>
      </div>
    `;
  }

  function renderTable(rows) {
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="skeleton">No hay movimientos en este rango.</td></tr>`;
      return;
    }
    tbody.innerHTML = rows
      .slice()
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
      .map(
        (m) => `
        <tr data-id="${m.id}">
          <td>${m.fecha}</td>
          <td><span class="tipo-badge ${m.tipo}">${m.tipo === "ingreso" ? "Ingreso" : "Gasto"}</span></td>
          <td>${categoriaLabel[m.categoria] || m.categoria}</td>
          <td>${m.descripcion}</td>
          <td class="monto ${m.tipo}">${m.tipo === "gasto" ? "-" : ""}${formatCurrency(m.monto)}</td>
          <td class="row-actions">
            <button type="button" data-edit="${m.id}" title="Editar"><i class="ti ti-pencil"></i></button>
            <button type="button" data-delete="${m.id}" title="Eliminar"><i class="ti ti-trash"></i></button>
          </td>
        </tr>`
      )
      .join("");
  }

  function render() {
    const rows = filtered();
    renderStats(rows);
    renderTable(rows);
  }

  function openModal(mov) {
    form.reset();
    document.getElementById("mov-id").value = mov ? mov.id : "";
    modalTitulo.textContent = mov ? "Editar movimiento" : "Nuevo movimiento";
    if (mov) {
      document.getElementById("mov-tipo").value = mov.tipo;
      document.getElementById("mov-categoria").value = mov.categoria;
      document.getElementById("mov-descripcion").value = mov.descripcion;
      document.getElementById("mov-monto").value = mov.monto;
      document.getElementById("mov-fecha").value = mov.fecha;
    } else {
      document.getElementById("mov-fecha").value = new Date().toISOString().slice(0, 10);
    }
    modal.classList.add("open");
  }

  function closeModal() {
    modal.classList.remove("open");
  }

  document.getElementById("btn-nuevo-movimiento").addEventListener("click", () => openModal(null));
  document.getElementById("btn-cancelar-movimiento").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("mov-id").value;
    const data = {
      tipo: document.getElementById("mov-tipo").value,
      categoria: document.getElementById("mov-categoria").value,
      descripcion: document.getElementById("mov-descripcion").value.trim(),
      monto: parseFloat(document.getElementById("mov-monto").value),
      fecha: document.getElementById("mov-fecha").value,
    };
    if (id) {
      const idx = movimientos.findIndex((m) => m.id === id);
      movimientos[idx] = { ...movimientos[idx], ...data };
    } else {
      movimientos.push({ id: "m" + Date.now(), ...data });
    }
    closeModal();
    render();
  });

  tbody.addEventListener("click", (e) => {
    const editId = e.target.closest("[data-edit]")?.dataset.edit;
    const delId = e.target.closest("[data-delete]")?.dataset.delete;
    if (editId) openModal(movimientos.find((m) => m.id === editId));
    if (delId) {
      movimientos = movimientos.filter((m) => m.id !== delId);
      render();
    }
  });

  ["f-desde", "f-hasta", "f-tipo", "search-input"].forEach((id) =>
    document.getElementById(id).addEventListener("input", render)
  );

  document.getElementById("btn-limpiar-filtros").addEventListener("click", () => {
    document.getElementById("f-desde").value = "";
    document.getElementById("f-hasta").value = "";
    document.getElementById("f-tipo").value = "";
    document.getElementById("search-input").value = "";
    render();
  });

  render();

  // ---------- Simulador de amortización (sistema de cuota fija / francés) ----------
  // Convención 30/360: tasa mensual = tasa anual / 12, primer vencimiento a 30 días.

  const amMonto = document.getElementById("am-monto");
  const amCuotas = document.getElementById("am-cuotas");
  const amFrecuencia = document.getElementById("am-frecuencia");
  const amInteres = document.getElementById("am-interes");
  const amResultado = document.getElementById("amortizacion-resultado");
  const amTbody = document.getElementById("amortizacion-tbody");

  function addDaysN(baseDate, days) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function calcularAmortizacion() {
    const monto = parseFloat(amMonto.value);
    const n = parseInt(amCuotas.value, 10);
    const tasaAnual = parseFloat(amInteres.value);
    const diasPeriodo = parseInt(amFrecuencia.value, 10); // 30 = mensual, 15 = quincenal

    if (!monto || !n || tasaAnual < 0 || !diasPeriodo) {
      amResultado.style.display = "none";
      return;
    }

    const periodosPorAnio = 360 / diasPeriodo; // 12 mensual, 24 quincenal
    const i = tasaAnual / 100 / periodosPorAnio; // tasa por período, convención 30/360
    const cuota = i === 0 ? monto / n : (monto * i) / (1 - Math.pow(1 + i, -n));

    let saldo = monto;
    let totalInteres = 0;
    const filas = [];
    const hoy = new Date();

    for (let k = 1; k <= n; k++) {
      const interes = saldo * i;
      const capital = cuota - interes;
      saldo = Math.max(0, saldo - capital);
      totalInteres += interes;
      filas.push({
        numero: k,
        fecha: addDaysN(hoy, diasPeriodo * k),
        cuota,
        interes,
        capital,
        saldo,
      });
    }

    document.getElementById("am-cuota-valor").textContent = formatCurrency(cuota);
    document.getElementById("am-total-valor").textContent = formatCurrency(cuota * n);
    document.getElementById("am-intereses-valor").textContent = formatCurrency(totalInteres);

    amTbody.innerHTML = filas
      .map(
        (f) => `
        <tr>
          <td>${f.numero}</td>
          <td>${f.fecha}</td>
          <td>${formatCurrency(f.cuota)}</td>
          <td>${formatCurrency(f.interes)}</td>
          <td>${formatCurrency(f.capital)}</td>
          <td>${formatCurrency(f.saldo)}</td>
        </tr>`
      )
      .join("");

    amResultado.style.display = "block";
  }

  document.getElementById("btn-calcular-amortizacion").addEventListener("click", calcularAmortizacion);
  amFrecuencia.addEventListener("change", calcularAmortizacion);
  calcularAmortizacion(); // muestra un ejemplo al cargar, como en el mockup
})();
