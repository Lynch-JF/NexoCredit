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
    { id: "cb-1", nombre: "Carlos Peña", telefono: "809-555-0212", clientes: 8, cobradoHoy: 1400, zona: "Zona norte", estado: "activo" },
    { id: "cb-2", nombre: "Ana Reyes", telefono: "809-555-0345", clientes: 12, cobradoHoy: 2100, zona: "Zona centro", estado: "activo" },
    { id: "cb-3", nombre: "Miguel Sosa", telefono: "809-555-0567", clientes: 0, cobradoHoy: 0, zona: "Zona este", estado: "inactivo" }
  ],

  clientes: [
    { id: "cl-1", nombre: "Rosa Martínez", cedula: "001-2345678-9", telefono: "809-555-0134", zona: "Zona norte", saldoPendiente: 3200, cuota: 500, estado: "al_dia" },
    { id: "cl-2", nombre: "Julio Ramírez", cedula: "002-1122334-5", telefono: "809-555-0189", zona: "Zona norte", saldoPendiente: 2250, cuota: 750, estado: "mora", diasMora: 3 },
    { id: "cl-3", nombre: "Elena Cruz", cedula: "003-9988776-1", telefono: "809-555-0271", zona: "Zona norte", saldoPendiente: 900, cuota: 300, estado: "al_dia" },
    { id: "cl-4", nombre: "Miguel Ortiz", cedula: "001-5544332-2", telefono: "809-555-0398", zona: "Zona centro", saldoPendiente: 4800, cuota: 600, estado: "al_dia" },
    { id: "cl-5", nombre: "Yolanda Féliz", cedula: "004-2233445-7", telefono: "809-555-0452", zona: "Zona centro", saldoPendiente: 1500, cuota: 500, estado: "mora", diasMora: 7 }
  ],

  pagos: [
    { id: "pg-1", fecha: "2026-07-21", clienteId: "cl-1", clienteNombre: "Rosa Martínez", cobradorId: "cb-1", cobradorNombre: "Carlos Peña", monto: 500, metodo: "efectivo" },
    { id: "pg-2", fecha: "2026-07-21", clienteId: "cl-4", clienteNombre: "Miguel Ortiz", cobradorId: "cb-2", cobradorNombre: "Ana Reyes", monto: 600, metodo: "transferencia" },
    { id: "pg-3", fecha: "2026-07-22", clienteId: "cl-3", clienteNombre: "Elena Cruz", cobradorId: "cb-1", cobradorNombre: "Carlos Peña", monto: 300, metodo: "efectivo" },
    { id: "pg-4", fecha: "2026-07-23", clienteId: "cl-2", clienteNombre: "Julio Ramírez", cobradorId: "cb-1", cobradorNombre: "Carlos Peña", monto: 750, metodo: "efectivo" },
    { id: "pg-5", fecha: "2026-07-24", clienteId: "cl-5", clienteNombre: "Yolanda Féliz", cobradorId: "cb-2", cobradorNombre: "Ana Reyes", monto: 500, metodo: "transferencia" },
    { id: "pg-6", fecha: "2026-07-25", clienteId: "cl-1", clienteNombre: "Rosa Martínez", cobradorId: "cb-1", cobradorNombre: "Carlos Peña", monto: 500, metodo: "efectivo" },
    { id: "pg-7", fecha: "2026-07-27", clienteId: "cl-4", clienteNombre: "Miguel Ortiz", cobradorId: "cb-2", cobradorNombre: "Ana Reyes", monto: 600, metodo: "efectivo" },
    { id: "pg-8", fecha: "2026-07-28", clienteId: "cl-3", clienteNombre: "Elena Cruz", cobradorId: "cb-1", cobradorNombre: "Carlos Peña", monto: 300, metodo: "transferencia" },
    { id: "pg-9", fecha: "2026-07-29", clienteId: "cl-1", clienteNombre: "Rosa Martínez", cobradorId: "cb-1", cobradorNombre: "Carlos Peña", monto: 500, metodo: "efectivo" },
    { id: "pg-10", fecha: "2026-07-29", clienteId: "cl-2", clienteNombre: "Julio Ramírez", cobradorId: "cb-1", cobradorNombre: "Carlos Peña", monto: 750, metodo: "efectivo" }
  ]
};
