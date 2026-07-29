/* PrestaFácil — Admin App — lógica compartida entre pantallas */

function pfFormatCurrency(value) {
  return "$" + Number(value).toLocaleString("es-DO");
}

function pfRequireSession() {
  const session = pfApi.getSession();
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  return session;
}

function pfMountShell(session) {
  const chip = document.querySelector("[data-user-chip]");
  if (chip) chip.textContent = session.usuario.nombre;

  const logoutBtn = document.querySelector("[data-logout]");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      pfApi.logout();
      window.location.href = "index.html";
    });
  }

  const page = document.body.dataset.page;
  document.querySelectorAll(".sidebar-nav a").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === page);
  });
}
