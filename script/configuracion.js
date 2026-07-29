/* PrestaFácil — Admin App — Configuración */

(async () => {
  const session = pfRequireSession();
  if (!session) return;

  pfMountShell(session);

  const form = document.getElementById("form-configuracion");
  const confirmation = document.getElementById("save-confirmation");

  const config = await pfApi.getConfiguracion();

  document.getElementById("cfg-nombre").value = config.nombreNegocio;
  document.getElementById("cfg-telefono").value = config.telefono;
  document.getElementById("cfg-moneda").value = config.moneda;
  document.getElementById("cfg-tasa").value = config.tasaInteresDefault;
  document.getElementById("cfg-gracia").value = config.diasGracia;
  document.getElementById("cfg-frecuencia").value = config.frecuenciaCuotaDefault;

  let confirmationTimeout = null;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    await pfApi.guardarConfiguracion({
      nombreNegocio: document.getElementById("cfg-nombre").value.trim(),
      telefono: document.getElementById("cfg-telefono").value.trim(),
      moneda: document.getElementById("cfg-moneda").value,
      tasaInteresDefault: Number(document.getElementById("cfg-tasa").value),
      diasGracia: Number(document.getElementById("cfg-gracia").value),
      frecuenciaCuotaDefault: document.getElementById("cfg-frecuencia").value
    });

    confirmation.classList.add("visible");
    clearTimeout(confirmationTimeout);
    confirmationTimeout = setTimeout(() => {
      confirmation.classList.remove("visible");
    }, 2500);
  });
})();
