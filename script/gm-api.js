/* PrestaFácil — Admin App — capa de conexión
   Por ahora responde con datos de mock-data.js simulando latencia de red.
   El nombre y la forma de las funciones se mantienen estables para que,
   cuando exista backend real (Express + Supabase), solo haya que
   reemplazar el cuerpo de cada función por un fetch() real. */

const pfApi = (() => {
  const LATENCY = 300;
  const TOKEN_KEY = "pf_token";
  const USER_KEY = "pf_usuario";

  function delay(value) {
    return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
  }

  function login(usuario, password) {
    const cuenta = window.PF_MOCK.cuentas.find(
      (c) => c.usuario === usuario && c.password === password
    );

    if (!cuenta) {
      return delay(null);
    }

    const session = {
      token: "mock-token-" + Date.now(),
      usuario: { nombre: cuenta.nombre, rol: cuenta.rol, usuario: cuenta.usuario }
    };

    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.usuario));

    return delay(session);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function getSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    const usuarioRaw = localStorage.getItem(USER_KEY);
    if (!token || !usuarioRaw) return null;
    return { token, usuario: JSON.parse(usuarioRaw) };
  }

  function getDashboardSummary() {
    return delay(window.PF_MOCK.resumen);
  }

  function getCobradoresActivos() {
    return delay(window.PF_MOCK.cobradores);
  }

  function getClientes() {
    return delay(window.PF_MOCK.clientes);
  }

  function crearCliente(cliente) {
    const nuevo = {
      id: "cl-" + Date.now(),
      saldoPendiente: 0,
      estado: "al_dia",
      ...cliente
    };
    window.PF_MOCK.clientes.unshift(nuevo);
    return delay(nuevo);
  }

  function getCobradores() {
    return delay(window.PF_MOCK.cobradores);
  }

  function crearCobrador(cobrador) {
    const nuevo = {
      id: "cb-" + Date.now(),
      clientes: 0,
      cobradoHoy: 0,
      estado: "activo",
      ...cobrador
    };
    window.PF_MOCK.cobradores.unshift(nuevo);
    return delay(nuevo);
  }

  return {
    login,
    logout,
    getSession,
    getDashboardSummary,
    getCobradoresActivos,
    getClientes,
    crearCliente,
    getCobradores,
    crearCobrador
  };
})();
