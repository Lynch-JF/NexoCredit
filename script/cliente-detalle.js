// cliente-detalle.js
// NOTA: no tengo el contenido real de mock-data.js / gm-api.js, así que esta
// versión trabaja con datos de ejemplo en memoria (array `clientesMock`) para
// que la página funcione de inmediato. Cuando me pases esos dos archivos,
// lo cambio para leer el cliente real vía pfApi.getCliente(id) y registrar
// pagos con pfApi.crearPago(), igual que hacen las demás páginas con pfApi.

(function () {
  const clientesMock = [
    {
      id: "c1",
      nombre: "Julio Ramírez",
      cedula: "001-1234567-8",
      telefono: "809-555-0101",
      zona: "Zona Norte",
      cobrador: "Carlos Peña",
      desde: "2026-03-15",
      prestamo: { monto: 15000, tasaAnual: 10, cuotas: 10, frecuenciaDias: 15, fechaInicio: "2026-04-01", cuotasPagadas: 3 },
      pagos: [
        { fecha: "2026-05-01", monto: 1584.5, metodo: "efectivo", cobrador: "Carlos Peña", nota: "Cuota #1" },
        { fecha: "2026-05-16", monto: 1584.5, metodo: "efectivo", cobrador: "Carlos Peña", nota: "Cuota #2" },
        { fecha: "2026-05-31", monto: 1584.5, metodo: "transferencia", cobrador: "Carlos Peña", nota: "Cuota #3" },
      ],
    },
    {
      id: "c2",
      nombre: "María Torres",
      cedula: "001-9876543-2",
      telefono: "809-555-0202",
      zona: "Zona Este",
      cobrador: "Ana Beltré",
      desde: "2026-01-10",
      prestamo: { monto: 8000, tasaAnual: 12, cuotas: 6, frecuenciaDias: 30, fechaInicio: "2026-02-01", cuotasPagadas: 5 },
      pagos: [
        { fecha: "2026-03-01", monto: 1379.75, metodo: "efectivo", cobrador: "Ana Beltré", nota: "Cuota #1" },
        { fecha: "2026-04-01", monto: 1379.75, metodo: "efectivo", cobrador: "Ana Beltré", nota: "Cuota #2" },
        { fecha: "2026-05-01", monto: 1379.75, metodo: "efectivo", cobrador: "Ana Beltré", nota: "Cuota #3" },
        { fecha: "2026-06-01", monto: 1379.75, metodo: "transferencia", cobrador: "Ana Beltré", nota: "Cuota #4" },
        { fecha: "2026-07-01", monto: 1379.75, metodo: "efectivo", cobrador: "Ana Beltré", nota: "Cuota #5" },
      ],
    },
  ];

  function formatCurrency(n) {
    return "$" + Number(n).toLocaleString("es-DO", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function addDaysN(baseDate, days) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function calcularCuota(monto, tasaAnual, n, diasPeriodo) {
    const periodosPorAnio = 360 / diasPeriodo;
    const i = tasaAnual / 100 / periodosPorAnio;
    return i === 0 ? monto / n : (monto * i) / (1 - Math.pow(1 + i, -n));
  }

  function generarAmortizacion(prestamo) {
    const { monto, tasaAnual, cuotas, frecuenciaDias, fechaInicio, cuotasPagadas } = prestamo;
    const periodosPorAnio = 360 / frecuenciaDias;
    const i = tasaAnual / 100 / periodosPorAnio;
    const cuota = calcularCuota(monto, tasaAnual, cuotas, frecuenciaDias);
    const hoy = new Date().toISOString().slice(0, 10);

    let saldo = monto;
    const filas = [];
    for (let k = 1; k <= cuotas; k++) {
      const interes = saldo * i;
      const capital = cuota - interes;
      saldo = Math.max(0, saldo - capital);
      const fecha = addDaysN(fechaInicio, frecuenciaDias * k);
      let estado = "pendiente";
      if (k <= cuotasPagadas) estado = "pagada";
      else if (fecha < hoy) estado = "atrasada";
      filas.push({ numero: k, fecha, cuota, interes, capital, saldo, estado });
    }
    return filas;
  }

  function getClienteId() {
    return new URLSearchParams(window.location.search).get("id");
  }

  let cliente = null;

  function cargarCliente() {
    const id = getClienteId();
    cliente = clientesMock.find((c) => c.id === id) || clientesMock[0]; // fallback para pruebas sin ?id=
    render();
  }

  function estadoCliente() {
    const schedule = generarAmortizacion(cliente.prestamo);
    return schedule.some((f) => f.estado === "atrasada") ? "mora" : "al-dia";
  }

  function render() {
    if (!cliente) {
      document.getElementById("cliente-nombre").textContent = "Cliente no encontrado";
      document.getElementById("cliente-subtitulo").textContent = "Verifica el enlace o vuelve a la lista de clientes.";
      document.getElementById("cliente-contenido").style.display = "none";
      return;
    }

    document.getElementById("cliente-nombre").textContent = cliente.nombre;
    document.getElementById("cliente-subtitulo").textContent = `Cédula ${cliente.cedula} · ${cliente.zona}`;

    document.getElementById("info-cedula").textContent = cliente.cedula;
    document.getElementById("info-telefono").textContent = cliente.telefono;
    document.getElementById("info-zona").textContent = cliente.zona;
    document.getElementById("info-cobrador").textContent = cliente.cobrador;
    document.getElementById("info-desde").textContent = cliente.desde;

    const estado = estadoCliente();
    document.getElementById("info-estado").innerHTML = `<span class="estado-badge ${estado}">${estado === "mora" ? "En mora" : "Al día"}</span>`;

    const schedule = generarAmortizacion(cliente.prestamo);
    const cuota = calcularCuota(cliente.prestamo.monto, cliente.prestamo.tasaAnual, cliente.prestamo.cuotas, cliente.prestamo.frecuenciaDias);
    const pendientes = schedule.filter((f) => f.estado !== "pagada");
    const saldoPendiente = pendientes.reduce((s, f) => s + f.capital, 0);
    const proxima = pendientes[0];

    document.getElementById("prestamo-monto").textContent = formatCurrency(cliente.prestamo.monto);
    document.getElementById("prestamo-saldo").textContent = formatCurrency(saldoPendiente);
    document.getElementById("prestamo-cuota").textContent = formatCurrency(cuota);
    document.getElementById("prestamo-proximo").textContent = proxima ? proxima.fecha : "Préstamo saldado";
    document.getElementById("prestamo-meta").textContent =
      `${cliente.prestamo.cuotas} cuotas ${cliente.prestamo.frecuenciaDias === 15 ? "quincenales" : "mensuales"} · ${cliente.prestamo.tasaAnual}% anual · inicio ${cliente.prestamo.fechaInicio}`;

    document.getElementById("amortizacion-tbody").innerHTML = schedule
      .map(
        (f) => `
        <tr>
          <td>${f.numero}</td>
          <td>${f.fecha}</td>
          <td>${formatCurrency(f.cuota)}</td>
          <td>${formatCurrency(f.interes)}</td>
          <td>${formatCurrency(f.capital)}</td>
          <td>${formatCurrency(f.saldo)}</td>
          <td><span class="estado-badge ${f.estado}">${f.estado === "pagada" ? "Pagada" : f.estado === "atrasada" ? "Atrasada" : "Pendiente"}</span></td>
        </tr>`
      )
      .join("");

    document.getElementById("pagos-tbody").innerHTML = cliente.pagos.length
      ? cliente.pagos
          .slice()
          .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
          .map(
            (p) => `
        <tr>
          <td>${p.fecha}</td>
          <td>${formatCurrency(p.monto)}</td>
          <td>${p.metodo === "efectivo" ? "Efectivo" : p.metodo === "transferencia" ? "Transferencia" : "Otro"}</td>
          <td>${p.cobrador || "-"}</td>
          <td>${p.nota || "-"}</td>
        </tr>`
          )
          .join("")
      : `<tr><td colspan="5" class="skeleton">Sin pagos registrados todavía.</td></tr>`;
  }

  // ---------- Modal: registrar pago ----------

  const modalPago = document.getElementById("modal-registrar-pago");
  const formPago = document.getElementById("form-registrar-pago");

  document.getElementById("btn-registrar-pago").addEventListener("click", () => {
    document.getElementById("pago-fecha").value = new Date().toISOString().slice(0, 10);
    document.getElementById("pago-cobrador").value = cliente.cobrador;
    modalPago.classList.add("open");
  });
  document.getElementById("btn-cancelar-pago").addEventListener("click", () => modalPago.classList.remove("open"));
  modalPago.addEventListener("click", (e) => { if (e.target === modalPago) modalPago.classList.remove("open"); });

  formPago.addEventListener("submit", (e) => {
    e.preventDefault();
    cliente.pagos.push({
      fecha: document.getElementById("pago-fecha").value,
      monto: parseFloat(document.getElementById("pago-monto").value),
      metodo: document.getElementById("pago-metodo").value,
      cobrador: document.getElementById("pago-cobrador").value.trim(),
      nota: document.getElementById("pago-nota").value.trim(),
    });
    // Simplificación: cada pago registrado marca la siguiente cuota pendiente como pagada.
    if (cliente.prestamo.cuotasPagadas < cliente.prestamo.cuotas) {
      cliente.prestamo.cuotasPagadas += 1;
    }
    formPago.reset();
    modalPago.classList.remove("open");
    render();
  });

  // ---------- Modal: editar cliente ----------

  const modalEditar = document.getElementById("modal-editar-cliente");
  const formEditar = document.getElementById("form-editar-cliente");

  document.getElementById("btn-editar-cliente").addEventListener("click", () => {
    document.getElementById("edit-nombre").value = cliente.nombre;
    document.getElementById("edit-cedula").value = cliente.cedula;
    document.getElementById("edit-telefono").value = cliente.telefono;
    document.getElementById("edit-zona").value = cliente.zona;
    modalEditar.classList.add("open");
  });
  document.getElementById("btn-cancelar-editar").addEventListener("click", () => modalEditar.classList.remove("open"));
  modalEditar.addEventListener("click", (e) => { if (e.target === modalEditar) modalEditar.classList.remove("open"); });

  formEditar.addEventListener("submit", (e) => {
    e.preventDefault();
    cliente.nombre = document.getElementById("edit-nombre").value.trim();
    cliente.cedula = document.getElementById("edit-cedula").value.trim();
    cliente.telefono = document.getElementById("edit-telefono").value.trim();
    cliente.zona = document.getElementById("edit-zona").value.trim();
    modalEditar.classList.remove("open");
    render();
  });

  cargarCliente();
})();
