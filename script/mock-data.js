/* PrestaFácil — Admin App — datos de prueba
   Reemplazar por llamadas reales en gm-api.js cuando exista backend. */

window.PF_MOCK = {
  cuentas: [
    { usuario: "admin", password: "admin123", nombre: "Franco Michel", rol: "admin" }
  ],

  resumen: {
    carteraActiva: 284500,
    cobradoHoy: 6200,
    enMora: 18900
  },

  cobradores: [
    { id: "cb-1", nombre: "Carlos Peña", clientes: 8, cobradoHoy: 1400, zona: "Zona norte" },
    { id: "cb-2", nombre: "Ana Reyes", clientes: 12, cobradoHoy: 2100, zona: "Zona centro" }
  ]
};
